#!/usr/bin/env python3
"""
Sounder JSONL-to-KRF Converter
===============================
Reads ~400K records from artifacts2/, trogdon/, and industry/
and generates Charlotte KRF S-expression files.

Usage:
    python converter.py [--source DIR] [--output DIR] [--dry-run]

Output structure:
    output/
        nodes/
            breeders_cps.krf       — 65K CPS breeders
            breeders_nsr.krf       — 3.7K NSR breeders
            breeders_aba.krf       — 8.8K ABA breeders
            animals.krf            — pedigree-registered animals
            sires.krf              — named sires
            dams.krf               — production sows
            buyers.krf             — customers / buyers
            shows.krf              — show events
        edges/
            pedigree.krf           — sire/dam relationships
            ownership.krf          — bred-by, owned-by
            temporal.krf           — temporal spine weaving
        signals/
            breedings.krf          — breeding events
            farrowings.krf         — farrowing events
            sales_trogdon.krf      — TSP sales + SCOnline lots
            sales_industry.krf     — Summer Spectacular + Exposition
        metrics/
            litter_metrics.krf     — litter size, born alive, stillborn
"""

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path


# ── Paths ──

SCRIPT_DIR = Path(__file__).parent
DEFAULT_SOURCE = SCRIPT_DIR.parent / "sounder_scripts"
DEFAULT_OUTPUT = SCRIPT_DIR / "output"


# ── Normalization maps ──

BREED_MAP = {
    "HAMPSHIRE": "Hampshire",
    "BERKSHIRE": "Berkshire",
    "DUROC": "Duroc",
    "LANDRACE": "Landrace",
    "POLAND": "Poland",
    "SPOT": "Spot",
    "YORKSHIRE": "Yorkshire",
    "CHESTER": "Chester",
    "HEREFORD": "Hereford",
    "TAMWORTH": "Tamworth",
    "CROSS": "Cross",
    "LIGHTCROSS": "LightCross",
    "LIGHT_CROSS": "LightCross",
    "LIGHT_CROSSBRED": "LightCross",
    "DARKCROSS": "DarkCross",
    "DARK_CROSS": "DarkCross",
    "DARK_CROSSBRED": "DarkCross",
    "CROSSBRED": "Cross",
}

STRESS_MAP = {
    "NEGATIVE": "Negative",
    "POSITIVE": "Positive",
    "CARRIER": "Carrier",
    "UNTESTED": "Untested",
    "": "Untested",
}

GENDER_MAP = {
    "BOY": "MALE",
    "GIRL": "FEMALE",
    "MALE": "MALE",
    "FEMALE": "FEMALE",
}

ROLE_MAP = {
    "GILT": "GILT",
    "BARROW": "BARROW",
    "BOAR": "BOAR",
    "SOW": "SOW",
}

PEDIGREE_CATEGORY_MAP = {
    "GILT": "PedigreeGilt",
    "BARROW": "PedigreeBarrow",
    "BOAR": "PedigreeBoar",
    "SOW": "PedigreeSow",
}

RETIREMENT_MAP = {
    "CULLED": "Culled",
    "DECEASED": "Deceased",
    "CANNIBAL": "Cannibal",
    "RETIRED": "Retired",
    "NOTGOODENOUGH": "NotGoodEnough",
    "INJURY": "Injury",
    "GREWTOOLARGE": "GrewTooLarge",
    "SOLD": "Sold",
}

REGISTRY_MAP = {
    "Hampshire": "NSR",
    "Duroc": "NSR",
    "Yorkshire": "NSR",
    "Landrace": "NSR",
    "Chester": "CPS",
    "Poland": "CPS",
    "Spot": "CPS",
    "Berkshire": "ABA",
}


# ── KRF helpers ──

def krf_string(s):
    """Escape a string for KRF S-expression. Double-quote it."""
    if s is None:
        return '"unknown"'
    s = str(s).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def make_id(*parts):
    """Generate a stable ID from parts. Uses hash for long composites."""
    clean = "_".join(str(p).strip().upper().replace(" ", "_") for p in parts if p)
    # Remove characters that are invalid in KRF identifiers
    clean = "".join(c for c in clean if c.isalnum() or c in "_-")
    if len(clean) > 60:
        h = hashlib.md5(clean.encode()).hexdigest()[:12]
        return clean[:40] + "_" + h
    return clean


def normalize_breed(raw):
    """Normalize breed string to KRF type name."""
    if not raw:
        return None
    return BREED_MAP.get(raw.upper().strip(), None)


def normalize_stress(raw):
    """Normalize stress status to KRF type name."""
    if raw is None:
        return "Untested"
    return STRESS_MAP.get(raw.upper().strip(), "Untested")


def normalize_date(raw):
    """Extract YYYY-MM-DD from ISO datetime or date string."""
    if not raw:
        return None
    s = str(raw).strip()
    if "T" in s:
        s = s.split("T")[0]
    if len(s) >= 10 and s[4] == "-" and s[7] == "-":
        return s[:10]
    # Try MM/DD/YYYY
    parts = s.split("/")
    if len(parts) == 3:
        m, d, y = parts
        if len(y) == 4:
            return f"{y}-{m.zfill(2)}-{d.zfill(2)}"
    return s


def normalize_name(raw):
    """Clean up name strings — replace underscores with spaces, title case."""
    if not raw:
        return None
    return str(raw).replace("_", " ").strip()


# ── Stats tracker ──

class Stats:
    def __init__(self):
        self.counts = {}
        self.errors = 0

    def inc(self, category, n=1):
        self.counts[category] = self.counts.get(category, 0) + n

    def total(self):
        return sum(self.counts.values())

    def report(self):
        print("\n  === Conversion Report ===")
        for cat in sorted(self.counts.keys()):
            print(f"    {cat:40s}  {self.counts[cat]:>8,}")
        print(f"    {'TOTAL':40s}  {self.total():>8,}")
        if self.errors:
            print(f"    {'ERRORS':40s}  {self.errors:>8,}")
        print()


# ── File readers ──

def read_jsonl(path):
    """Read a JSONL file, yielding parsed dicts. Skips bad lines."""
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip().rstrip(",")
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                pass  # skip malformed


def read_json_array(path):
    """Read a JSON file containing an array of objects."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    return []


# ── KRF file writer ──

class KRFWriter:
    """Accumulates KRF facts and writes them to a .krf file."""

    def __init__(self, path, microtheory, header_comment=""):
        self.path = Path(path)
        self.microtheory = microtheory
        self.header_comment = header_comment
        self.facts = []

    def add(self, fact):
        """Add a single S-expression fact string."""
        self.facts.append(fact)

    def add_many(self, facts):
        """Add multiple facts."""
        self.facts.extend(facts)

    def write(self):
        """Write all accumulated facts to the .krf file."""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            if self.header_comment:
                for line in self.header_comment.strip().split("\n"):
                    f.write(f";;; {line}\n")
                f.write("\n")
            f.write(f"(in-microtheory {self.microtheory})\n\n")
            for fact in self.facts:
                f.write(fact + "\n")
        return len(self.facts)


# ================================================================
# CONVERTERS — one function per data source
# ================================================================

def convert_cps_breeders(source, output, stats):
    """CERTIFIED_PEDIGREE_SWINE.jsonl -> CPS breeder NODEs."""
    path = source / "artifacts2" / "CERTIFIED_PEDIGREE_SWINE.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "breeders_cps.krf",
        "SounderBreedersMt",
        "CPS Breeders — Certified Pedigree Swine (Chester, Poland, Spot)\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        mark = rec.get("MARK", "").strip()
        if not mark or mark in seen:
            continue
        seen.add(mark)
        bid = make_id("BREEDER", mark)
        cps_num = rec.get("HERDMARK", "")
        city = rec.get("CITY", "")
        state = rec.get("STATE", "")

        w.add(f"(isa {bid} Breeder)")
        w.add(f"(hasHerdmark {bid} {krf_string(mark)})")
        if cps_num:
            w.add(f"(hasCPSNumber {bid} {krf_string(cps_num)})")
        if city:
            w.add(f"(hasCity {bid} {krf_string(city)})")
        if state:
            w.add(f"(hasState {bid} {krf_string(state)})")
        w.add(f"(memberOf {bid} CPS)")
        w.add("")

    count = w.write()
    stats.inc("breeders_cps", count)
    print(f"    breeders_cps.krf          {count:>8,} facts")


def convert_cps_with_breed(source, output, stats):
    """cps.jsonl -> CPS breeders with breed specialization (supplements main CPS)."""
    path = source / "artifacts2" / "cps.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "breeders_cps_breeds.krf",
        "SounderBreedersMt",
        "CPS Breeders — breed specialization overlay\n"
        f"Source: {path.name}"
    )
    for rec in read_jsonl(path):
        mark = rec.get("mark", "").strip()
        breed_raw = rec.get("breed", "")
        breed = normalize_breed(breed_raw)
        if not mark or not breed:
            continue
        bid = make_id("BREEDER", mark)
        # This creates a breeder-breeds-breed edge (not a hasBreed — that's for animals)
        # We use a comment to note their breed specialization
        w.add(f";; {mark} breeds {breed}")
        w.add(f"(isa {bid} Breeder)")
        w.add(f"(hasHerdmark {bid} {krf_string(mark)})")
        cps = rec.get("CPS", "")
        if cps:
            w.add(f"(hasCPSNumber {bid} {krf_string(cps)})")
        city = rec.get("city", "")
        state = rec.get("state", "")
        if city:
            w.add(f"(hasCity {bid} {krf_string(city)})")
        if state:
            w.add(f"(hasState {bid} {krf_string(state)})")
        w.add(f"(memberOf {bid} CPS)")
        w.add("")

    count = w.write()
    stats.inc("breeders_cps_breeds", count)
    print(f"    breeders_cps_breeds.krf   {count:>8,} facts")


def convert_nsr_breeders(source, output, stats):
    """nsr_breeders.jsonl -> NSR breeder NODEs."""
    path = source / "artifacts2" / "nsr_breeders.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "breeders_nsr.krf",
        "SounderBreedersMt",
        "NSR Breeders — National Swine Registry (Hampshire, Duroc, Yorkshire, Landrace)\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        mark = rec.get("mark", "").strip()
        if not mark or mark in seen:
            continue
        seen.add(mark)
        bid = make_id("BREEDER", mark)
        city = rec.get("city", "")
        state = rec.get("state", "")

        w.add(f"(isa {bid} Breeder)")
        w.add(f"(hasHerdmark {bid} {krf_string(mark)})")
        if city:
            w.add(f"(hasCity {bid} {krf_string(city)})")
        if state:
            w.add(f"(hasState {bid} {krf_string(state)})")
        w.add(f"(memberOf {bid} NSR)")
        w.add("")

    count = w.write()
    stats.inc("breeders_nsr", count)
    print(f"    breeders_nsr.krf          {count:>8,} facts")


def convert_aba_breeders(source, output, stats):
    """aba_breeders.jsonl -> ABA breeder NODEs."""
    path = source / "artifacts2" / "aba_breeders.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "breeders_aba.krf",
        "SounderBreedersMt",
        "ABA Breeders — American Berkshire Association\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        mark = rec.get("mark", "").strip()
        if not mark or mark in seen:
            continue
        seen.add(mark)
        bid = make_id("BREEDER", mark)
        city = rec.get("city", "")
        state = rec.get("state", "")

        w.add(f"(isa {bid} Breeder)")
        w.add(f"(hasHerdmark {bid} {krf_string(mark)})")
        if city:
            w.add(f"(hasCity {bid} {krf_string(city)})")
        if state:
            w.add(f"(hasState {bid} {krf_string(state)})")
        w.add(f"(memberOf {bid} ABA)")
        w.add("")

    count = w.write()
    stats.inc("breeders_aba", count)
    print(f"    breeders_aba.krf          {count:>8,} facts")


def convert_pedigrees(source, output, stats):
    """pedigrees.jsonl -> animal NODEs + pedigree EDGEs."""
    path = source / "artifacts2" / "pedigrees.jsonl"
    if not path.exists():
        return
    w_animals = KRFWriter(
        output / "nodes" / "animals.krf",
        "SounderAnimalsMt",
        "Registered animals — pedigree data\n"
        f"Source: {path.name}"
    )
    w_edges = KRFWriter(
        output / "edges" / "pedigree.krf",
        "SounderPedigreeMt",
        "Pedigree edges — sire/dam relationships\n"
        f"Source: {path.name}"
    )
    seen_animals = set()
    for rec in read_jsonl(path):
        rno = rec.get("rno", "").strip()
        if not rno or rno in seen_animals:
            continue
        seen_animals.add(rno)

        aid = make_id("ANIMAL", rno)
        ear = rec.get("ear", "")
        breed = normalize_breed(rec.get("breed", ""))
        name = rec.get("name", "")
        role = rec.get("role", "").upper().strip()
        dob = normalize_date(rec.get("dob"))
        herdmark = rec.get("dmrk", "")  # breeder herdmark

        # Animal NODE
        w_animals.add(f"(isa {aid} SwineAnimal)")
        w_animals.add(f"(hasRegistrationNumber {aid} {krf_string(rno)})")
        if ear:
            w_animals.add(f"(hasEarNotch {aid} {krf_string(ear)})")
        if breed:
            w_animals.add(f"(hasBreed {aid} {breed})")
        if name:
            w_animals.add(f"(hasShortName {aid} {krf_string(name)})")
        if role and role in ROLE_MAP:
            w_animals.add(f"(hasRole {aid} {ROLE_MAP[role]})")
        if role and role in PEDIGREE_CATEGORY_MAP:
            w_animals.add(f"(hasPedigreeCategory {aid} {PEDIGREE_CATEGORY_MAP[role]})")
        if dob:
            w_animals.add(f"(bornOn {aid} {krf_string(dob)})")

        # Breeder edge
        if herdmark:
            bid = make_id("BREEDER", herdmark)
            w_edges.add(f"(bredBy {aid} {bid})")

        # Sire edge
        srno = rec.get("srno", "").strip()
        if srno:
            sire_id = make_id("ANIMAL", srno)
            w_edges.add(f"(hasSire {aid} {sire_id})")
            w_edges.add(f"(isSireOf {sire_id} {aid})")

        # Dam edge
        drno = rec.get("drno", "").strip()
        if drno:
            dam_id = make_id("ANIMAL", drno)
            w_edges.add(f"(hasDam {aid} {dam_id})")
            w_edges.add(f"(isDamOf {dam_id} {aid})")

        w_animals.add("")
        w_edges.add("")

    ac = w_animals.write()
    ec = w_edges.write()
    stats.inc("animals", ac)
    stats.inc("pedigree_edges", ec)
    print(f"    animals.krf               {ac:>8,} facts")
    print(f"    pedigree.krf              {ec:>8,} facts")


def convert_sires(source, output, stats):
    """sires.jsonl -> Sire NODEs."""
    path = source / "artifacts2" / "sires.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "sires.krf",
        "SounderAnimalsMt",
        "Named sires — breeding males with stress status\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        name = rec.get("value", "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        sid = make_id("SIRE", name)
        stress = normalize_stress(rec.get("stress", ""))

        w.add(f"(isa {sid} Sire)")
        w.add(f"(hasShortName {sid} {krf_string(name)})")
        w.add(f"(hasStressStatus {sid} {stress})")
        w.add(f"(hasGender {sid} MALE)")
        w.add("")

    count = w.write()
    stats.inc("sires", count)
    print(f"    sires.krf                 {count:>8,} facts")


def convert_sows_artifacts(source, output, stats):
    """sows.jsonl -> Dam NODEs."""
    path = source / "artifacts2" / "sows.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "dams.krf",
        "SounderAnimalsMt",
        "Production sows (dams) — TSP herd inventory\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        name = rec.get("name", "").strip()
        ear = rec.get("ear", "").strip()
        key = name + "|" + ear
        if not name or key in seen:
            continue
        seen.add(key)

        # Use RNO if present, else name+ear
        rno = rec.get("rno", "").strip()
        if rno:
            did = make_id("ANIMAL", rno)
        else:
            did = make_id("DAM", name, ear) if ear else make_id("DAM", name)

        breed = normalize_breed(rec.get("breed", ""))
        stress = normalize_stress(rec.get("stress", ""))
        dob = normalize_date(rec.get("dob"))
        reason = rec.get("reason", "").strip().upper()

        w.add(f"(isa {did} Dam)")
        w.add(f"(hasShortName {did} {krf_string(name)})")
        if ear:
            w.add(f"(hasEarNotch {did} {krf_string(ear)})")
        if breed:
            w.add(f"(hasBreed {did} {breed})")
        w.add(f"(hasStressStatus {did} {stress})")
        w.add(f"(hasGender {did} FEMALE)")
        w.add(f"(hasRole {did} SOW)")
        if dob:
            w.add(f"(bornOn {did} {krf_string(dob)})")
        if rno:
            w.add(f"(hasRegistrationNumber {did} {krf_string(rno)})")
        if reason and reason in RETIREMENT_MAP:
            w.add(f"(hasRetirementReason {did} {RETIREMENT_MAP[reason]})")
        w.add("")

    count = w.write()
    stats.inc("dams_artifacts", count)
    print(f"    dams.krf                  {count:>8,} facts")


def convert_sows_trogdon(source, output, stats):
    """trogdon/sows.json -> Dam NODEs from farm management system."""
    path = source / "trogdon" / "sows.json"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "dams_trogdon.krf",
        "SounderAnimalsMt",
        "Production sows — Trogdon farm management system\n"
        f"Source: {path.name}"
    )
    data = read_json_array(path)
    seen = set()
    for rec in data:
        uid = rec.get("id", "").strip()
        if not uid or uid in seen:
            continue
        seen.add(uid)

        name = rec.get("name", "").strip()
        ear = rec.get("earNotch", "").strip()
        did = make_id("DAM", uid[:12])

        breed = normalize_breed(rec.get("sowBreed", ""))
        stress = normalize_stress(rec.get("stressStatus", ""))
        dob = normalize_date(rec.get("birthDate"))
        sire_name = rec.get("sire", "").strip()
        dam_name = rec.get("dam", "").strip()

        w.add(f"(isa {did} Dam)")
        if name:
            w.add(f"(hasShortName {did} {krf_string(name)})")
        if ear:
            w.add(f"(hasEarNotch {did} {krf_string(ear)})")
        if breed:
            w.add(f"(hasBreed {did} {breed})")
        w.add(f"(hasStressStatus {did} {stress})")
        w.add(f"(hasGender {did} FEMALE)")
        w.add(f"(hasRole {did} SOW)")
        if dob:
            w.add(f"(bornOn {did} {krf_string(dob)})")

        # Parentage edges (by name — no RNO available)
        if sire_name:
            sire_id = make_id("SIRE", sire_name)
            w.add(f"(hasSire {did} {sire_id})")
        if dam_name:
            parent_dam_id = make_id("DAM", dam_name)
            w.add(f"(hasDam {did} {parent_dam_id})")
        w.add("")

    count = w.write()
    stats.inc("dams_trogdon", count)
    print(f"    dams_trogdon.krf          {count:>8,} facts")


def convert_buyers(source, output, stats):
    """tsp_customers.jsonl -> Buyer NODEs."""
    path = source / "artifacts2" / "tsp_customers.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "buyers.krf",
        "SounderBuyersMt",
        "Customers / Buyers — Trogdon Show Pigs\n"
        f"Source: {path.name}"
    )
    seen = set()
    for rec in read_jsonl(path):
        name = rec.get("name", "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        bid = make_id("BUYER", name)

        w.add(f"(isa {bid} Buyer)")
        w.add(f"(hasShortName {bid} {krf_string(name)})")
        first = rec.get("first", "").strip()
        last = rec.get("last", "").strip()
        if first and last:
            w.add(f"(hasFullName {bid} {krf_string(first + ' ' + last)})")
        w.add("")

    count = w.write()
    stats.inc("buyers", count)
    print(f"    buyers.krf                {count:>8,} facts")


def convert_shows(source, output, stats):
    """sma_shows.jsonl -> Show NODEs."""
    path = source / "artifacts2" / "sma_shows.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "nodes" / "shows.krf",
        "SounderShowsMt",
        "Show events from SMA circuit\n"
        f"Source: {path.name}"
    )
    for i, rec in enumerate(read_jsonl(path)):
        location = rec.get("location", "").strip()
        city = rec.get("city", "").strip()
        state = rec.get("state", "").strip()
        start = rec.get("start", "")
        end = rec.get("end", "")
        sid = make_id("SHOW", location, start) if location else make_id("SHOW", str(i))

        w.add(f"(isa {sid} Show)")
        if location:
            w.add(f"(hasShowName {sid} {krf_string(location)})")
        if start:
            w.add(f"(hasShowDate {sid} {krf_string(start)})")
        if city and state:
            w.add(f"(hasShowLocation {sid} {krf_string(city + ' ' + state)})")
        w.add("")

    count = w.write()
    stats.inc("shows", count)
    print(f"    shows.krf                 {count:>8,} facts")


def convert_breedings_artifacts(source, output, stats):
    """breedings.jsonl -> BreedingEvent SIGNALs."""
    path = source / "artifacts2" / "breedings.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "signals" / "breedings.krf",
        "SounderBreedingsMt",
        "Active breeding events — TSP current gestations\n"
        f"Source: {path.name}"
    )
    for i, rec in enumerate(read_jsonl(path)):
        sire_name = rec.get("sire", "").strip()
        dam_name = rec.get("dam", "").strip()
        start = rec.get("start", "")
        due = rec.get("due", "")
        parity = rec.get("parity")
        sire_stress = normalize_stress(rec.get("sire_stress", ""))

        eid = make_id("BREEDING", start, sire_name, dam_name)
        sire_id = make_id("SIRE", sire_name) if sire_name else None
        dam_id = make_id("DAM", dam_name) if dam_name else None

        w.add(f"(isa {eid} BreedingEvent)")
        if start:
            w.add(f"(bredOn {eid} {krf_string(start)})")
        if due:
            w.add(f"(dueOn {eid} {krf_string(due)})")
        if sire_id:
            w.add(f"(breedingEventSire {eid} {sire_id})")
        if dam_id:
            w.add(f"(breedingEventDam {eid} {dam_id})")
        if parity is not None:
            w.add(f"(farrowEventParity {eid} {parity})")
        w.add("")

    count = w.write()
    stats.inc("breedings_artifacts", count)
    print(f"    breedings.krf             {count:>8,} facts")


def convert_litters(source, output, stats):
    """litters.jsonl -> FarrowEvent SIGNALs + Litter metrics."""
    path = source / "artifacts2" / "litters.jsonl"
    if not path.exists():
        return
    w_farrow = KRFWriter(
        output / "signals" / "farrowings.krf",
        "SounderBreedingsMt",
        "Farrowing events — recent litters\n"
        f"Source: {path.name}"
    )
    w_metrics = KRFWriter(
        output / "metrics" / "litter_metrics.krf",
        "SounderMetricsMt",
        "Litter metrics — size, wean data\n"
        f"Source: {path.name}"
    )
    for rec in read_jsonl(path):
        sire_name = rec.get("SIRE_SHORT_NAME", "").strip()
        dam_name = rec.get("DAM_SHORT_NAME", "").strip()
        litter_num = rec.get("LITTER_NUMBER")
        date_insem = normalize_date(rec.get("DATE_OF_INSEMINATION"))
        date_farrow = normalize_date(rec.get("DATE_OF_FARROW"))
        date_wean = normalize_date(rec.get("DATE_OF_WEAN"))
        expected = normalize_date(rec.get("EXPECTED_DATE_OF_FARROW"))
        litter_size = rec.get("LITTER_SIZE")

        fid = make_id("FARROW", str(litter_num) if litter_num else "", dam_name)
        lid = make_id("LITTER", str(litter_num) if litter_num else "", dam_name)
        dam_id = make_id("DAM", dam_name) if dam_name else None
        sire_id = make_id("SIRE", sire_name) if sire_name else None

        # Farrow event
        w_farrow.add(f"(isa {fid} FarrowEvent)")
        if date_farrow:
            w_farrow.add(f"(farrowedOn {fid} {krf_string(date_farrow)})")
        if dam_id:
            w_farrow.add(f"(farrowEventDam {fid} {dam_id})")
        w_farrow.add(f"(farrowEventLitter {fid} {lid})")

        # Associated breeding event
        if date_insem:
            bid = make_id("BREEDING", date_insem, sire_name or "", dam_name)
            w_farrow.add(f"(breedingEventResult {bid} {fid})")
            if sire_id:
                w_farrow.add(f"(breedingEventSire {bid} {sire_id})")

        # Litter NODE + metrics
        w_metrics.add(f"(isa {lid} Litter)")
        if litter_size is not None:
            w_metrics.add(f"(hasLitterSize {lid} {litter_size})")
            w_metrics.add(f"(hasBornAlive {lid} {litter_size})")
        w_farrow.add("")
        w_metrics.add("")

    fc = w_farrow.write()
    mc = w_metrics.write()
    stats.inc("farrowings", fc)
    stats.inc("litter_metrics", mc)
    print(f"    farrowings.krf            {fc:>8,} facts")
    print(f"    litter_metrics.krf        {mc:>8,} facts")


def convert_cycles_trogdon(source, output, stats):
    """trogdon/cycles.json -> BreedingEvent + FarrowEvent SIGNALs."""
    path = source / "trogdon" / "cycles.json"
    if not path.exists():
        return
    w_breed = KRFWriter(
        output / "signals" / "breedings_trogdon.krf",
        "SounderBreedingsMt",
        "Breeding events — Trogdon farm management (20K+ cycles)\n"
        f"Source: {path.name}"
    )
    w_farrow = KRFWriter(
        output / "signals" / "farrowings_trogdon.krf",
        "SounderBreedingsMt",
        "Farrowing events — Trogdon farm management\n"
        f"Source: {path.name}"
    )
    w_metrics = KRFWriter(
        output / "metrics" / "litter_metrics_trogdon.krf",
        "SounderMetricsMt",
        "Litter metrics — Trogdon breeding cycles\n"
        f"Source: {path.name}"
    )
    data = read_json_array(path)
    for rec in data:
        uid = rec.get("id", "").strip()
        if not uid:
            continue

        sire_name = rec.get("serviceSireName", "").strip()
        sow_name = rec.get("sowName", "").strip()
        date_bred = normalize_date(rec.get("dateBred"))
        date_farrow = normalize_date(rec.get("dateFarrowed"))
        date_due = normalize_date(rec.get("dueDate"))
        date_wean = normalize_date(rec.get("dateWeaned"))
        has_farrowed = rec.get("hasFarrowed", False)
        alive = rec.get("aliveCount")
        stillborn = rec.get("stillbornCount")
        male_count = rec.get("maleCount")
        female_count = rec.get("femaleCount")
        litter_num = rec.get("litterNumber")
        parity = rec.get("parityNumber")
        sire_stress = normalize_stress(rec.get("serviceSireStressStatus", ""))

        bid = make_id("BREEDING", uid[:12])
        sire_id = make_id("SIRE", sire_name) if sire_name else None
        dam_id = make_id("DAM", sow_name) if sow_name else None

        # Breeding event
        w_breed.add(f"(isa {bid} BreedingEvent)")
        if date_bred:
            w_breed.add(f"(bredOn {bid} {krf_string(date_bred)})")
        if date_due:
            w_breed.add(f"(dueOn {bid} {krf_string(date_due)})")
        if sire_id:
            w_breed.add(f"(breedingEventSire {bid} {sire_id})")
        if dam_id:
            w_breed.add(f"(breedingEventDam {bid} {dam_id})")
        w_breed.add("")

        # Farrow event (if farrowed)
        if has_farrowed and date_farrow:
            fid = make_id("FARROW", uid[:12])
            lid = make_id("LITTER", uid[:12])

            w_farrow.add(f"(isa {fid} FarrowEvent)")
            w_farrow.add(f"(farrowedOn {fid} {krf_string(date_farrow)})")
            if dam_id:
                w_farrow.add(f"(farrowEventDam {fid} {dam_id})")
            if parity is not None:
                w_farrow.add(f"(farrowEventParity {fid} {parity})")
            w_farrow.add(f"(farrowEventLitter {fid} {lid})")
            w_farrow.add(f"(breedingEventResult {bid} {fid})")
            w_farrow.add("")

            # Litter metrics
            w_metrics.add(f"(isa {lid} Litter)")
            total = 0
            if alive is not None:
                w_metrics.add(f"(hasBornAlive {lid} {alive})")
                total += alive
            if stillborn is not None:
                w_metrics.add(f"(hasStillborn {lid} {stillborn})")
                total += stillborn
            if total > 0:
                w_metrics.add(f"(hasLitterSize {lid} {total})")
            w_metrics.add("")

    bc = w_breed.write()
    fc = w_farrow.write()
    mc = w_metrics.write()
    stats.inc("breedings_trogdon", bc)
    stats.inc("farrowings_trogdon", fc)
    stats.inc("litter_metrics_trogdon", mc)
    print(f"    breedings_trogdon.krf     {bc:>8,} facts")
    print(f"    farrowings_trogdon.krf    {fc:>8,} facts")
    print(f"    litter_metrics_trogdon.krf{mc:>8,} facts")


def convert_sales_trogdon(source, output, stats):
    """trogdon/sales.jsonl -> SaleTransaction SIGNALs."""
    path = source / "trogdon" / "sales.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "signals" / "sales_trogdon.krf",
        "SounderSalesMt",
        "Sales — Trogdon Show Pigs direct sales\n"
        f"Source: {path.name}"
    )
    for i, rec in enumerate(read_jsonl(path)):
        dam = rec.get("dam", "").strip()
        ear = rec.get("ear", "").strip()
        role = rec.get("type", "").strip().upper()
        customer = rec.get("customer", "").strip()
        price = rec.get("price")
        date = normalize_date(rec.get("date"))

        sid = make_id("SALE", "TSP", str(i), ear)
        aid = make_id("ANIMAL", "TSP", ear, dam) if ear else make_id("ANIMAL", "TSP", str(i))

        w.add(f"(isa {sid} SaleTransaction)")
        w.add(f"(saleAnimal {sid} {aid})")
        if price is not None:
            w.add(f"(hasSalePrice {sid} {price})")
        if date:
            w.add(f"(soldOn {sid} {krf_string(date)})")
        if customer:
            buyer_id = make_id("BUYER", customer)
            w.add(f"(soldTo {sid} {buyer_id})")
        w.add(f"(hasAuctionType {sid} PrivateTreaty)")
        w.add(f"(soldBy {sid} BREEDER_TSP5)")

        # Animal stub
        w.add(f"(isa {aid} SwineAnimal)")
        if ear:
            w.add(f"(hasEarNotch {aid} {krf_string(ear)})")
        if role and role in ROLE_MAP:
            w.add(f"(hasRole {aid} {ROLE_MAP[role]})")
        if dam:
            dam_id = make_id("DAM", dam)
            w.add(f"(hasDam {aid} {dam_id})")
        w.add("")

    count = w.write()
    stats.inc("sales_trogdon", count)
    print(f"    sales_trogdon.krf         {count:>8,} facts")


def convert_lots_trogdon(source, output, stats):
    """trogdon/lots.json -> SaleTransaction SIGNALs from SCOnline."""
    path = source / "trogdon" / "lots.json"
    if not path.exists():
        return
    w = KRFWriter(
        output / "signals" / "sales_sconline.krf",
        "SounderSalesMt",
        "Sales — SC Online auction lots\n"
        f"Source: {path.name}"
    )
    data = read_json_array(path)
    for rec in data:
        lot_id = rec.get(":ID", "").strip()
        lot_num = rec.get("::LOT", "")
        ear = rec.get("::EAR_NOTCH", "").strip()
        price = rec.get("::PRICE")
        bids = rec.get("::BIDS")
        opcode = rec.get("::OPCODE", "")

        if not lot_id:
            continue

        sid = make_id("SALE", "SCO", opcode, lot_num)
        aid = make_id("ANIMAL", "SCO", opcode, lot_num)

        w.add(f"(isa {sid} SaleTransaction)")
        w.add(f"(saleAnimal {sid} {aid})")
        if lot_num:
            w.add(f"(hasLotNumber {sid} {krf_string(lot_num)})")
        if price is not None:
            w.add(f"(hasSalePrice {sid} {price})")
        if bids is not None:
            w.add(f"(hasBidCount {sid} {bids})")
        w.add(f"(hasAuctionType {sid} Online)")
        w.add(f'(saleEvent {sid} {krf_string("SCONLINE-" + str(opcode))})')
        w.add(f"(soldAt {sid} AUCTION_SCONLINE)")

        # Extract animal info from tokens
        tokens = rec.get(":TOKENS", [])
        token_map = {}
        for tok in tokens:
            if tok.startswith("::") and ":" in tok[2:]:
                parts = tok[2:].split(":", 1)
                if len(parts) == 2:
                    token_map[parts[0]] = parts[1]

        w.add(f"(isa {aid} SwineAnimal)")
        if ear:
            w.add(f"(hasEarNotch {aid} {krf_string(ear)})")

        sire = token_map.get("SIRE", "")
        dam = token_map.get("DAM", "")
        sex = token_map.get("SEX", "").upper()
        breed_raw = token_map.get("BREED", "")

        if sire:
            sire_id = make_id("SIRE", sire)
            w.add(f"(hasSire {aid} {sire_id})")
        if dam:
            dam_id = make_id("DAM", dam)
            w.add(f"(hasDam {aid} {dam_id})")
        if sex and sex in ROLE_MAP:
            w.add(f"(hasRole {aid} {ROLE_MAP[sex]})")
        breed = normalize_breed(breed_raw)
        if breed:
            w.add(f"(hasBreed {aid} {breed})")
        w.add("")

    count = w.write()
    stats.inc("sales_sconline", count)
    print(f"    sales_sconline.krf        {count:>8,} facts")


def convert_summer_spectacular(source, output, stats):
    """industry/SUMMER_SPECTACULAR_LOTS.jsonl -> ShowEntry + SaleTransaction."""
    path = source / "industry" / "SUMMER_SPECTACULAR_LOTS.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "signals" / "sales_summer_spectacular.krf",
        "SounderSalesMt",
        "Summer Spectacular — NSR show and sale results\n"
        f"Source: {path.name}"
    )
    for i, rec in enumerate(read_jsonl(path)):
        show_id_raw = rec.get("SHOW", "")
        year = rec.get("YEAR", "")
        breed_raw = rec.get("SWINE_BREED", "")
        category = rec.get("PEDIGREE_CATEGORY", "").upper()
        placement = rec.get("PLACEMENT", "")
        lot = rec.get("LOT", "")
        ear = rec.get("EAR_NOTCH", "")
        breeder_id_raw = rec.get("BREEDER_IDENTIFIER", "")
        breeder_name = normalize_name(rec.get("BREEDER_NAME", ""))
        buyer_name = normalize_name(rec.get("BUYER_NAME", ""))
        buyer_city = rec.get("BUYER_CITY", "")
        buyer_state = rec.get("BUYER_STATE", "")
        price = rec.get("PRICE_POINT")

        sid = make_id("SALE", "SS", str(year), lot)
        eid = make_id("ENTRY", "SS", str(year), lot)
        aid = make_id("ANIMAL", "SS", str(year), lot)
        show_nid = make_id("SHOW", "SUMMER_SPECTACULAR", str(year))
        breed = normalize_breed(breed_raw)

        # Sale transaction
        w.add(f"(isa {sid} SaleTransaction)")
        w.add(f"(saleAnimal {sid} {aid})")
        if lot:
            w.add(f"(hasLotNumber {sid} {krf_string(lot)})")
        if price is not None:
            w.add(f"(hasSalePrice {sid} {price})")
        w.add(f"(hasAuctionType {sid} Live)")
        w.add(f'(saleEvent {sid} {krf_string("Summer Spectacular " + str(year))})')
        if buyer_name:
            buyer_id = make_id("BUYER", buyer_name)
            w.add(f"(soldTo {sid} {buyer_id})")
            w.add(f"(isa {buyer_id} Buyer)")
            w.add(f"(hasShortName {buyer_id} {krf_string(buyer_name)})")
            if buyer_city:
                w.add(f"(hasCity {buyer_id} {krf_string(buyer_city)})")
            if buyer_state:
                w.add(f"(hasState {buyer_id} {krf_string(buyer_state)})")

        # Show entry
        w.add(f"(isa {eid} ShowEntry)")
        w.add(f"(entryAnimal {eid} {aid})")
        w.add(f"(entryShow {eid} {show_nid})")
        if placement:
            # Parse placement — could be numeric or like "OS1", "RES"
            try:
                w.add(f"(placedAt {eid} {int(placement)})")
            except (ValueError, TypeError):
                w.add(f"(placedAt {eid} {krf_string(str(placement))})")
        if category and category in PEDIGREE_CATEGORY_MAP:
            w.add(f"(classifiedAs {eid} {PEDIGREE_CATEGORY_MAP[category]})")

        # Animal
        w.add(f"(isa {aid} SwineAnimal)")
        if ear:
            w.add(f"(hasEarNotch {aid} {krf_string(ear)})")
        if breed:
            w.add(f"(hasBreed {aid} {breed})")
        if category and category in ROLE_MAP:
            w.add(f"(hasRole {aid} {ROLE_MAP[category]})")
        if breeder_id_raw:
            breeder_nid = make_id("BREEDER", breeder_id_raw)
            w.add(f"(bredBy {aid} {breeder_nid})")
            if breeder_name:
                w.add(f"(hasShortName {breeder_nid} {krf_string(breeder_name)})")

        # Show node (emitted once — deduped by KRF loader)
        w.add(f"(isa {show_nid} Show)")
        w.add(f'(hasShowName {show_nid} {krf_string("Summer Spectacular " + str(year))})')
        w.add("")

    count = w.write()
    stats.inc("sales_summer_spectacular", count)
    print(f"    sales_summer_spectacular  {count:>8,} facts")


def convert_exposition(source, output, stats):
    """industry/THE_EXPOSITION_LOTS.jsonl -> ShowEntry + SaleTransaction."""
    path = source / "industry" / "THE_EXPOSITION_LOTS.jsonl"
    if not path.exists():
        return
    w = KRFWriter(
        output / "signals" / "sales_exposition.krf",
        "SounderSalesMt",
        "The Exposition — NSR show and sale results\n"
        f"Source: {path.name}"
    )
    for i, rec in enumerate(read_jsonl(path)):
        show_id_raw = rec.get("SHOW", "")
        year = rec.get("YEAR", "")
        breed_raw = rec.get("SWINE_BREED", "")
        category = rec.get("PEDIGREE_CATEGORY", "").upper()
        division = rec.get("DIVISION", "")
        placement = rec.get("PLACEMENT", "")
        lot = rec.get("LOT", "")
        ear = rec.get("EAR_NOTCH", "")
        exhibitor = normalize_name(rec.get("EXIBITOR_NAME", ""))
        exhibitor_state = rec.get("EXIBITOR_STATE", "")
        sire_name = normalize_name(rec.get("SIRE_NAME", ""))
        sire_of_dam = normalize_name(rec.get("SIRE_OF_DAM_NAME", ""))
        buyer_name = normalize_name(rec.get("BUYER_NAME", ""))
        buyer_state = rec.get("BUYER_STATE", "")
        price = rec.get("PRICE_POINT")

        sid = make_id("SALE", "EXPO", str(year), lot)
        eid = make_id("ENTRY", "EXPO", str(year), lot)
        aid = make_id("ANIMAL", "EXPO", str(year), lot)
        show_nid = make_id("SHOW", "EXPOSITION", str(year))
        breed = normalize_breed(breed_raw)

        # Sale transaction
        w.add(f"(isa {sid} SaleTransaction)")
        w.add(f"(saleAnimal {sid} {aid})")
        if lot:
            w.add(f"(hasLotNumber {sid} {krf_string(lot)})")
        if price is not None:
            w.add(f"(hasSalePrice {sid} {price})")
        w.add(f"(hasAuctionType {sid} Live)")
        w.add(f'(saleEvent {sid} {krf_string("The Exposition " + str(year))})')
        if buyer_name:
            buyer_id = make_id("BUYER", buyer_name)
            w.add(f"(soldTo {sid} {buyer_id})")
            w.add(f"(isa {buyer_id} Buyer)")
            w.add(f"(hasShortName {buyer_id} {krf_string(buyer_name)})")
            if buyer_state:
                w.add(f"(hasState {buyer_id} {krf_string(buyer_state)})")

        # Show entry
        w.add(f"(isa {eid} ShowEntry)")
        w.add(f"(entryAnimal {eid} {aid})")
        w.add(f"(entryShow {eid} {show_nid})")
        if division:
            class_id = make_id("CLASS", "EXPO", str(year), division)
            w.add(f"(enteredIn {eid} {class_id})")
        if placement:
            try:
                w.add(f"(placedAt {eid} {int(placement)})")
            except (ValueError, TypeError):
                w.add(f"(placedAt {eid} {krf_string(str(placement))})")
        if category and category in PEDIGREE_CATEGORY_MAP:
            w.add(f"(classifiedAs {eid} {PEDIGREE_CATEGORY_MAP[category]})")

        # Animal
        w.add(f"(isa {aid} SwineAnimal)")
        if ear:
            w.add(f"(hasEarNotch {aid} {krf_string(ear)})")
        if breed:
            w.add(f"(hasBreed {aid} {breed})")
        if category and category in ROLE_MAP:
            w.add(f"(hasRole {aid} {ROLE_MAP[category]})")

        # Sire
        if sire_name:
            sire_id = make_id("SIRE", sire_name)
            w.add(f"(hasSire {aid} {sire_id})")
            w.add(f"(isa {sire_id} Sire)")
            w.add(f"(hasShortName {sire_id} {krf_string(sire_name)})")

        # Maternal grandsire (sire of dam)
        if sire_of_dam:
            gsire_id = make_id("SIRE", sire_of_dam)
            w.add(f";; maternal grandsire: {sire_of_dam}")
            w.add(f"(isGrandsireOf {gsire_id} {aid})")

        # Show node
        w.add(f"(isa {show_nid} Show)")
        w.add(f'(hasShowName {show_nid} {krf_string("The Exposition " + str(year))})')
        w.add("")

    count = w.write()
    stats.inc("sales_exposition", count)
    print(f"    sales_exposition          {count:>8,} facts")


def convert_temporal_spine(source, output, stats):
    """temporal_weaving_edges.jsonl + unique_day/month/week/year -> temporal spine."""
    edges_path = source / "artifacts2" / "temporal_weaving_edges.jsonl"
    if not edges_path.exists():
        return
    w = KRFWriter(
        output / "edges" / "temporal.krf",
        "SounderTemporalMt",
        "Temporal spine — date/month/week/year hierarchy\n"
        f"Source: {edges_path.name}"
    )

    # Write temporal nodes first
    for temporal_file, node_type in [
        ("unique_day.jsonl", "TemporalDay"),
        ("unique_month.jsonl", "TemporalMonth"),
        ("unique_week.jsonl", "TemporalWeek"),
        ("unique_year.jsonl", "TemporalYear"),
    ]:
        p = source / "artifacts2" / temporal_file
        if not p.exists():
            continue
        for rec in read_jsonl(p):
            val = rec.get("value", "")
            if val:
                nid = make_id("TEMPORAL", val)
                w.add(f"(isa {nid} {node_type})")

    w.add("")
    w.add(";; === Temporal weaving edges ===")
    w.add("")

    # Write edges
    edge_count = 0
    for rec in read_jsonl(edges_path):
        src = rec.get("source", "")
        rel = rec.get("relation", "")
        tgt = rec.get("target", "")
        if not src or not tgt:
            continue

        # Extract value from "TemporalNode[2024-01-15]" format
        def extract_val(s):
            if "[" in s and "]" in s:
                return s[s.index("[") + 1:s.index("]")]
            return s

        src_val = extract_val(src)
        tgt_val = extract_val(tgt)
        src_id = make_id("TEMPORAL", src_val)
        tgt_id = make_id("TEMPORAL", tgt_val)

        w.add(f"(partOf {src_id} {tgt_id})")
        edge_count += 1

    count = w.write()
    stats.inc("temporal_spine", count)
    print(f"    temporal.krf              {count:>8,} facts")


def convert_ownership_edges(source, output, stats):
    """Generate ownership edges from pedigree + sale data."""
    # Ownership edges are derived from pedigree bredBy and sale soldTo
    # Most of these are already emitted inline in the animal/sale converters
    # This function generates the Trogdon Show Pigs breeder NODE
    w = KRFWriter(
        output / "edges" / "ownership.krf",
        "SounderOwnershipMt",
        "Ownership and commerce edges\n"
        "Known entities: Trogdon Show Pigs, SC Online, Wendt Group"
    )

    # Trogdon Show Pigs
    w.add("(isa BREEDER_TSP5 GeneticsCompany)")
    w.add('(hasShortName BREEDER_TSP5 "Trogdon Show Pigs")')
    w.add('(hasHerdmark BREEDER_TSP5 "TSP5")')
    w.add('(hasCity BREEDER_TSP5 "PEKIN")')
    w.add('(hasState BREEDER_TSP5 "IN")')
    w.add("(memberOf BREEDER_TSP5 ABA)")
    w.add("(memberOf BREEDER_TSP5 NSR)")
    w.add("")

    # SC Online auction house
    w.add("(isa AUCTION_SCONLINE AuctionHouse)")
    w.add('(hasShortName AUCTION_SCONLINE "ShowCircuit Online")')
    w.add("")

    # Wendt Group auction house
    w.add("(isa AUCTION_WENDT AuctionHouse)")
    w.add('(hasShortName AUCTION_WENDT "The Wendt Group")')
    w.add("")

    count = w.write()
    stats.inc("ownership_edges", count)
    print(f"    ownership.krf             {count:>8,} facts")


# ================================================================
# MAIN
# ================================================================

def main():
    parser = argparse.ArgumentParser(description="Sounder JSONL-to-KRF Converter")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE,
                        help="Path to sounder_scripts/ directory")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT,
                        help="Output directory for .krf files")
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse data and report stats without writing files")
    args = parser.parse_args()

    source = args.source
    output = args.output

    if not source.exists():
        print(f"ERROR: Source directory not found: {source}")
        sys.exit(1)

    print("=" * 55)
    print("  Sounder JSONL-to-KRF Converter")
    print("=" * 55)
    print(f"  Source:  {source}")
    print(f"  Output:  {output}")
    print()

    stats = Stats()
    t0 = time.time()

    # Create output dirs
    if not args.dry_run:
        for subdir in ["nodes", "edges", "signals", "metrics"]:
            (output / subdir).mkdir(parents=True, exist_ok=True)

    print("  Converting NODEs...")
    convert_cps_breeders(source, output, stats)
    convert_cps_with_breed(source, output, stats)
    convert_nsr_breeders(source, output, stats)
    convert_aba_breeders(source, output, stats)
    convert_pedigrees(source, output, stats)
    convert_sires(source, output, stats)
    convert_sows_artifacts(source, output, stats)
    convert_sows_trogdon(source, output, stats)
    convert_buyers(source, output, stats)
    convert_shows(source, output, stats)

    print("\n  Converting EDGEs...")
    convert_ownership_edges(source, output, stats)
    convert_temporal_spine(source, output, stats)

    print("\n  Converting SIGNALs...")
    convert_breedings_artifacts(source, output, stats)
    convert_litters(source, output, stats)
    convert_cycles_trogdon(source, output, stats)
    convert_sales_trogdon(source, output, stats)
    convert_lots_trogdon(source, output, stats)
    convert_summer_spectacular(source, output, stats)
    convert_exposition(source, output, stats)

    elapsed = time.time() - t0
    stats.report()
    print(f"  Completed in {elapsed:.1f}s")
    print(f"  Output: {output}")
    print("=" * 55)


if __name__ == "__main__":
    main()
