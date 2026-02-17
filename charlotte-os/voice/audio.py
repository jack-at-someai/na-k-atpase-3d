"""
Charlotte Voice Agent — Audio Utilities
========================================
mulaw <-> PCM conversion. Uses audioop on Python 3.12, pure-Python fallback for 3.13+.
"""

import base64
import struct
import sys

# audioop removed in Python 3.13
_HAS_AUDIOOP = sys.version_info < (3, 13)
if _HAS_AUDIOOP:
    import audioop

# ---- mulaw lookup tables (for 3.13+ fallback) ----

_MULAW_BIAS = 0x84
_MULAW_CLIP = 32635

# mulaw decode table: 256 entries, index = mulaw byte, value = 16-bit PCM
_MULAW_DECODE = []
for _b in range(256):
    _b_inv = ~_b & 0xFF
    _sign = _b_inv & 0x80
    _exponent = (_b_inv >> 4) & 0x07
    _mantissa = _b_inv & 0x0F
    _sample = ((_mantissa << 3) + _MULAW_BIAS) << _exponent
    _sample -= _MULAW_BIAS
    if _sign:
        _sample = -_sample
    _MULAW_DECODE.append(_sample)


def _mulaw_encode_sample(sample: int) -> int:
    """Encode one 16-bit PCM sample to mulaw byte."""
    sign = 0
    if sample < 0:
        sign = 0x80
        sample = -sample
    if sample > _MULAW_CLIP:
        sample = _MULAW_CLIP
    sample += _MULAW_BIAS

    exponent = 7
    mask = 0x4000
    while exponent > 0:
        if sample & mask:
            break
        exponent -= 1
        mask >>= 1

    mantissa = (sample >> (exponent + 3)) & 0x0F
    mulaw_byte = ~(sign | (exponent << 4) | mantissa) & 0xFF
    return mulaw_byte


# Pre-compute encode table for speed
_MULAW_ENCODE = bytearray(65536)
for _i in range(65536):
    _pcm = _i if _i < 32768 else _i - 65536
    _MULAW_ENCODE[_i] = _mulaw_encode_sample(_pcm)


# ---- Public API ----

def mulaw_to_pcm(mulaw_bytes: bytes) -> bytes:
    """Convert mulaw audio to 16-bit PCM (little-endian)."""
    if _HAS_AUDIOOP:
        return audioop.ulaw2lin(mulaw_bytes, 2)
    out = bytearray(len(mulaw_bytes) * 2)
    for i, b in enumerate(mulaw_bytes):
        sample = _MULAW_DECODE[b]
        struct.pack_into("<h", out, i * 2, sample)
    return bytes(out)


def pcm_to_mulaw(pcm_bytes: bytes) -> bytes:
    """Convert 16-bit PCM (little-endian) to mulaw."""
    if _HAS_AUDIOOP:
        return audioop.lin2ulaw(pcm_bytes, 2)
    n_samples = len(pcm_bytes) // 2
    out = bytearray(n_samples)
    for i in range(n_samples):
        sample = struct.unpack_from("<h", pcm_bytes, i * 2)[0]
        out[i] = _MULAW_ENCODE[sample & 0xFFFF]
    return bytes(out)


def pcm_resample(pcm_bytes: bytes, from_rate: int, to_rate: int) -> bytes:
    """Resample 16-bit PCM via linear interpolation."""
    if from_rate == to_rate:
        return pcm_bytes
    if _HAS_AUDIOOP:
        converted, _ = audioop.ratecv(pcm_bytes, 2, 1, from_rate, to_rate, None)
        return converted
    # Pure-Python linear interpolation
    n_in = len(pcm_bytes) // 2
    if n_in == 0:
        return b""
    ratio = from_rate / to_rate
    n_out = int(n_in / ratio)
    samples_in = struct.unpack(f"<{n_in}h", pcm_bytes)
    out = bytearray(n_out * 2)
    for i in range(n_out):
        src = i * ratio
        idx = int(src)
        frac = src - idx
        if idx + 1 < n_in:
            sample = int(samples_in[idx] * (1 - frac) + samples_in[idx + 1] * frac)
        else:
            sample = samples_in[min(idx, n_in - 1)]
        sample = max(-32768, min(32767, sample))
        struct.pack_into("<h", out, i * 2, sample)
    return bytes(out)


def b64_mulaw_to_pcm(b64_data: str) -> bytes:
    """Decode base64 mulaw (Twilio format) to PCM."""
    return mulaw_to_pcm(base64.b64decode(b64_data))


def pcm_to_b64_mulaw(pcm_bytes: bytes) -> str:
    """Encode PCM to base64 mulaw (Twilio format)."""
    return base64.b64encode(pcm_to_mulaw(pcm_bytes)).decode("ascii")
