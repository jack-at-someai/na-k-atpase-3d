"""
Charlotte Knowledge Graph — Big Bang Neural Network Visualization
=================================================================
Nodes explode from a singularity, drift outward, and synaptic
edges fire between them like a neural network igniting.

Run headless:   blender --background --python big_bang.py
Open in GUI:    blender --python big_bang.py
"""

import bpy
import math
import random
import os
from mathutils import Vector

# ============================================================
# PARAMETERS — Change these to control the visualization
# ============================================================

NUM_NODES = 200          # Total neuron/nodes
NUM_EDGES = 400          # Synaptic connections
EDGE_MAX_DIST = 10.0     # Max distance for a synapse to form
EXPANSION_RADIUS = 25.0  # How far nodes expand from center
NODE_SIZE_MIN = 0.15     # Smallest node sphere radius
NODE_SIZE_MAX = 0.45     # Largest node sphere radius
EDGE_THICKNESS = 0.035   # Synapse line thickness

# Animation
TOTAL_FRAMES = 300       # Total animation length
FPS = 30
BANG_DURATION = 60       # Frames for initial explosion
DRIFT_END = 160          # When nodes settle
EDGE_FORM_START = 80     # When synapses start firing
EDGE_FORM_END = 260      # When last synapses appear

# Aesthetics
SEED = 42

# Node color palette (emissive RGB + intensity)
NODE_COLORS = [
    (0.1, 0.4, 1.0, 30.0),    # Electric blue (dominant)
    (0.1, 0.4, 1.0, 25.0),    # Electric blue (variant)
    (0.3, 0.6, 1.0, 20.0),    # Light blue
    (0.0, 0.8, 1.0, 22.0),    # Cyan
    (0.5, 0.2, 1.0, 18.0),    # Purple
    (1.0, 0.4, 0.1, 20.0),    # Hot orange (rare hub nodes)
    (1.0, 1.0, 1.0, 15.0),    # White hot
]

# Edge/synapse color
EDGE_COLOR = (0.15, 0.4, 1.0, 8.0)  # Glowing blue synapse

# ============================================================
# SETUP — Clean everything
# ============================================================

random.seed(SEED)

# Nuke the scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for block in bpy.data.meshes:
    if block.users == 0: bpy.data.meshes.remove(block)
for block in bpy.data.materials:
    if block.users == 0: bpy.data.materials.remove(block)
for block in bpy.data.curves:
    if block.users == 0: bpy.data.curves.remove(block)
for col in bpy.data.collections:
    bpy.data.collections.remove(col)

# ============================================================
# RENDER ENGINE + VIEWPORT — Kill all the grid/overlay shit
# ============================================================

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = TOTAL_FRAMES
scene.render.fps = FPS
scene.render.engine = 'BLENDER_EEVEE'
scene.eevee.taa_render_samples = 64

# Bloom
try:
    scene.eevee.use_bloom = True
    scene.eevee.bloom_threshold = 0.2
    scene.eevee.bloom_intensity = 1.5
    scene.eevee.bloom_radius = 6.5
    scene.eevee.bloom_color = (0.8, 0.9, 1.0)
except:
    pass

# World — pure black void
world = bpy.data.worlds.get("World")
if not world:
    world = bpy.data.worlds.new("World")
scene.world = world
world.color = (0.0, 0.0, 0.0)
try:
    wn = world.node_tree.nodes
    for node in wn:
        if node.type == 'BACKGROUND':
            node.inputs['Color'].default_value = (0.0, 0.0, 0.0, 1.0)
            node.inputs['Strength'].default_value = 0.0
except:
    pass

# Kill grid, floor, axes, everything in ALL 3D viewports
for area in bpy.context.screen.areas if hasattr(bpy.context, 'screen') and bpy.context.screen else []:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                # Kill overlays
                space.overlay.show_floor = False
                space.overlay.show_axis_x = False
                space.overlay.show_axis_y = False
                space.overlay.show_axis_z = False
                space.overlay.show_cursor = False
                space.overlay.show_object_origins = False
                space.overlay.show_relationship_lines = False
                space.overlay.show_outline_selected = False
                space.overlay.show_extras = False
                space.overlay.show_bones = False
                space.overlay.show_motion_paths = False
                space.overlay.show_text = False
                space.overlay.show_stats = False
                try:
                    space.overlay.show_grid_background = False
                except:
                    pass
                # Set to rendered view (Material Preview as fallback)
                try:
                    space.shading.type = 'RENDERED'
                except:
                    space.shading.type = 'MATERIAL'
                space.shading.background_type = 'WORLD'
                # Hide gizmos
                space.show_gizmo = False

# Render output
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.filepath = "//renders/big_bang_"
scene.render.image_settings.file_format = 'PNG'

# ============================================================
# COLLECTIONS
# ============================================================

nodes_col = bpy.data.collections.new("Neurons")
edges_col = bpy.data.collections.new("Synapses")
scene.collection.children.link(nodes_col)
scene.collection.children.link(edges_col)

# ============================================================
# MATERIALS — Glowing emissive neural network look
# ============================================================

node_materials = []
for i, (r, g, b, intensity) in enumerate(NODE_COLORS):
    mat = bpy.data.materials.new(name=f"NeuronMat_{i}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = (r, g, b, 1.0)
    emission.inputs['Strength'].default_value = intensity

    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(emission.outputs['Emission'], output.inputs['Surface'])
    node_materials.append(mat)

# Synapse material — bright glowing line
edge_mat = bpy.data.materials.new(name="SynapseMat")
edge_mat.use_nodes = True
en = edge_mat.node_tree.nodes
el = edge_mat.node_tree.links
en.clear()
e_emission = en.new('ShaderNodeEmission')
e_emission.inputs['Color'].default_value = (EDGE_COLOR[0], EDGE_COLOR[1], EDGE_COLOR[2], 1.0)
e_emission.inputs['Strength'].default_value = EDGE_COLOR[3]
e_output = en.new('ShaderNodeOutputMaterial')
el.new(e_emission.outputs['Emission'], e_output.inputs['Surface'])

# ============================================================
# NODE POSITIONS — Clustered, organic, neural
# ============================================================

def random_sphere_point(radius):
    """Random point in sphere volume with cluster tendency."""
    u = random.random()
    v = random.random()
    theta = 2.0 * math.pi * u
    phi = math.acos(2.0 * v - 1.0)
    # Bias toward clusters — use cube root for volume distribution
    r = radius * (random.random() ** 0.5)
    x = r * math.sin(phi) * math.cos(theta)
    y = r * math.sin(phi) * math.sin(theta)
    z = r * math.cos(phi)
    return Vector((x, y, z))

class Neuron:
    def __init__(self, index):
        self.index = index
        self.final_pos = random_sphere_point(EXPANSION_RADIUS)
        self.size = random.uniform(NODE_SIZE_MIN, NODE_SIZE_MAX)
        # Bigger nodes get hotter colors (hub nodes)
        if self.size > NODE_SIZE_MAX * 0.8:
            self.material = random.choice(node_materials[-2:])  # Orange/white
        else:
            self.material = random.choice(node_materials[:5])    # Blues/purples
        self.birth_frame = random.randint(1, BANG_DURATION)
        self.turbulence = Vector((
            random.uniform(-4, 4),
            random.uniform(-4, 4),
            random.uniform(-4, 4),
        ))
        self.obj = None

neurons = [Neuron(i) for i in range(NUM_NODES)]

# ============================================================
# CREATE NEURON OBJECTS
# ============================================================

print(f"Creating {NUM_NODES} neurons...")

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.0)
template_mesh = bpy.context.active_object.data.copy()
bpy.ops.object.delete()

for n in neurons:
    mesh = template_mesh.copy()
    obj = bpy.data.objects.new(f"Neuron_{n.index:04d}", mesh)
    obj.data.materials.append(n.material)
    nodes_col.objects.link(obj)
    n.obj = obj

    # Frame 1: singularity — invisible at origin
    obj.location = (0, 0, 0)
    obj.scale = (0.001, 0.001, 0.001)
    obj.keyframe_insert(data_path="location", frame=1)
    obj.keyframe_insert(data_path="scale", frame=1)

    # Birth: pop in at origin
    obj.location = (0, 0, 0)
    obj.scale = (n.size, n.size, n.size)
    obj.keyframe_insert(data_path="location", frame=n.birth_frame)
    obj.keyframe_insert(data_path="scale", frame=n.birth_frame)

    # Mid-flight: overshoot with turbulence
    mid_frame = n.birth_frame + int((DRIFT_END - n.birth_frame) * 0.45)
    mid_pos = n.final_pos * 1.25 + n.turbulence
    obj.location = mid_pos.to_tuple()
    obj.keyframe_insert(data_path="location", frame=mid_frame)

    # Settle
    settle_frame = random.randint(DRIFT_END - 20, DRIFT_END + 10)
    obj.location = n.final_pos.to_tuple()
    obj.keyframe_insert(data_path="location", frame=settle_frame)

    # Gentle drift (alive, breathing)
    drift = n.final_pos + Vector((
        random.uniform(-0.3, 0.3),
        random.uniform(-0.3, 0.3),
        random.uniform(-0.3, 0.3),
    ))
    obj.location = drift.to_tuple()
    obj.keyframe_insert(data_path="location", frame=TOTAL_FRAMES)

bpy.data.meshes.remove(template_mesh)

# ============================================================
# SYNAPSE EDGES — nearest neighbor connections
# ============================================================

print(f"Computing {NUM_EDGES} synapses...")

edges = []
used_pairs = set()
sorted_neurons = sorted(neurons, key=lambda n: n.final_pos.length)

for n in sorted_neurons:
    if len(edges) >= NUM_EDGES:
        break
    neighbors = sorted(neurons, key=lambda o: (o.final_pos - n.final_pos).length)
    for neighbor in neighbors[1:8]:  # Check 7 nearest for denser connectivity
        if len(edges) >= NUM_EDGES:
            break
        pair = tuple(sorted([n.index, neighbor.index]))
        dist = (n.final_pos - neighbor.final_pos).length
        if pair not in used_pairs and dist < EDGE_MAX_DIST:
            used_pairs.add(pair)
            edges.append((n, neighbor, dist))

edges.sort(key=lambda e: e[2])
print(f"  Created {len(edges)} synapses")

# ============================================================
# CREATE SYNAPSE CURVES WITH ANIMATION
# ============================================================

print("Firing synapses...")

for i, (neuron_a, neuron_b, dist) in enumerate(edges):
    t = i / max(len(edges) - 1, 1)
    appear_frame = int(EDGE_FORM_START + t * (EDGE_FORM_END - EDGE_FORM_START))

    curve_data = bpy.data.curves.new(name=f"Synapse_{i:04d}", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = EDGE_THICKNESS
    curve_data.bevel_resolution = 3
    curve_data.materials.append(edge_mat)

    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(1)

    curve_data.bevel_factor_end = 0.0
    curve_obj = bpy.data.objects.new(f"Synapse_{i:04d}", curve_data)
    edges_col.objects.link(curve_obj)

    p0 = spline.bezier_points[0]
    p1 = spline.bezier_points[1]
    pos_a = neuron_a.final_pos
    pos_b = neuron_b.final_pos

    p0.co = pos_a
    p1.co = pos_b

    # Gentle curve — not ramrod straight
    offset = Vector((random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5)))
    handle_offset = (pos_b - pos_a) * 0.33 + offset
    p0.handle_right = pos_a + handle_offset
    p0.handle_left = pos_a - handle_offset
    p1.handle_right = pos_b + handle_offset
    p1.handle_left = pos_b - handle_offset

    # Animate: synapse fires over ~15 frames
    draw_duration = random.randint(8, 20)
    curve_data.bevel_factor_end = 0.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=appear_frame - 1)
    curve_data.bevel_factor_end = 1.0
    curve_data.keyframe_insert(data_path="bevel_factor_end", frame=appear_frame + draw_duration)

# ============================================================
# CAMERA — Immersive fly-through
# ============================================================

print("Setting up camera...")

cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 24  # Wide angle
cam_data.clip_end = 500
cam_obj = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Start inside the singularity, pull back to reveal the network
cam_obj.location = (0, -2, 0.3)
cam_obj.rotation_euler = (math.radians(88), 0, 0)
cam_obj.keyframe_insert(data_path="location", frame=1)
cam_obj.keyframe_insert(data_path="rotation_euler", frame=1)

cam_obj.location = (3, -12, 3)
cam_obj.rotation_euler = (math.radians(80), math.radians(3), math.radians(10))
cam_obj.keyframe_insert(data_path="location", frame=50)
cam_obj.keyframe_insert(data_path="rotation_euler", frame=50)

cam_obj.location = (8, -35, 10)
cam_obj.rotation_euler = (math.radians(75), 0, math.radians(8))
cam_obj.keyframe_insert(data_path="location", frame=140)
cam_obj.keyframe_insert(data_path="rotation_euler", frame=140)

# Slow orbit to show the full brain
cam_obj.location = (25, -30, 12)
cam_obj.rotation_euler = (math.radians(70), math.radians(3), math.radians(30))
cam_obj.keyframe_insert(data_path="location", frame=220)
cam_obj.keyframe_insert(data_path="rotation_euler", frame=220)

cam_obj.location = (35, -15, 15)
cam_obj.rotation_euler = (math.radians(62), math.radians(5), math.radians(55))
cam_obj.keyframe_insert(data_path="location", frame=TOTAL_FRAMES)
cam_obj.keyframe_insert(data_path="rotation_euler", frame=TOTAL_FRAMES)

# ============================================================
# LIGHTING — Minimal, let emissives do the work
# ============================================================

# Big bang flash at origin
bang_light_data = bpy.data.lights.new(name="BangFlash", type='POINT')
bang_light_data.energy = 0
bang_light_data.color = (0.7, 0.85, 1.0)
bang_light_data.shadow_soft_size = 1.0
bang_light = bpy.data.objects.new("BangFlash", bang_light_data)
bang_light.location = (0, 0, 0)
scene.collection.objects.link(bang_light)

bang_light_data.energy = 0
bang_light_data.keyframe_insert(data_path="energy", frame=1)
bang_light_data.energy = 100000
bang_light_data.keyframe_insert(data_path="energy", frame=4)
bang_light_data.energy = 200
bang_light_data.keyframe_insert(data_path="energy", frame=40)
bang_light_data.energy = 0
bang_light_data.keyframe_insert(data_path="energy", frame=120)

# ============================================================
# VIEWPORT CLEANUP SCRIPT — Runs on file open
# ============================================================
# Embed a handler so viewport is always clean when opened

startup_script = bpy.data.texts.new("startup_viewport_cleanup.py")
startup_script.write("""
import bpy

def clean_viewport():
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == 'VIEW_3D':
                for space in area.spaces:
                    if space.type == 'VIEW_3D':
                        space.overlay.show_floor = False
                        space.overlay.show_axis_x = False
                        space.overlay.show_axis_y = False
                        space.overlay.show_axis_z = False
                        space.overlay.show_cursor = False
                        space.overlay.show_object_origins = False
                        space.overlay.show_relationship_lines = False
                        space.overlay.show_outline_selected = False
                        space.overlay.show_extras = False
                        space.overlay.show_text = False
                        space.overlay.show_stats = False
                        try:
                            space.overlay.show_grid_background = False
                        except:
                            pass
                        space.shading.type = 'RENDERED'
                        space.shading.background_type = 'WORLD'
                        space.show_gizmo = False

# Run on load
if clean_viewport not in [h.__name__ for h in bpy.app.handlers.load_post]:
    bpy.app.handlers.load_post.append(lambda _: clean_viewport())
clean_viewport()
""")
startup_script.use_module = True

# Register as auto-run script
bpy.data.texts["startup_viewport_cleanup.py"].use_module = True

# ============================================================
# SAVE
# ============================================================

script_dir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in dir() else os.getcwd()
output_path = os.path.join(script_dir, "big_bang_constellation.blend")
bpy.ops.wm.save_as_mainfile(filepath=output_path)

print("\n" + "=" * 60)
print("CHARLOTTE — Neural Network Big Bang")
print("=" * 60)
print(f"  Neurons:  {NUM_NODES}")
print(f"  Synapses: {len(edges)}")
print(f"  Frames:   {TOTAL_FRAMES} ({TOTAL_FRAMES/FPS:.1f}s at {FPS}fps)")
print(f"  Saved:    {output_path}")
print()
print("  Open in Blender and press Space to play!")
print("  Viewport: Rendered mode, no grid, pure void.")
print("=" * 60)
