# Industrial GLB Model Inspection Results
Generated: 2025-12-03

## Scene Bounding Box
- **Min:** [-0.97, -0.37, -82.25]
- **Max:** [86.79, 12.72, 129.12]
- **Size (W x H x D):** [87.75, 13.09, 211.37]
- **Center:** [42.91, 6.17, 23.44]

## Recommended Wall Positions (based on bounding box)
- North wall (Z-): `position=[0, 6.5, -84.3]`
- South wall (Z+): `position=[0, 6.5, 131.1]`
- East wall (X+): `position=[88.8, 6.5, 0]`
- West wall (X-): `position=[-3.0, 6.5, 0]`
- Wall half-sizes (N/S): `args=[45.9, 11.5, 0.5]`
- Wall half-sizes (E/W): `args=[0.5, 11.5, 107.7]`

## Available Meshes (78 total)

### Buildings (14)
- Building_1 through Building_13
- Cooling_tower

### Props
- Barrel_1, Barrel_2, Barrel_3
- Box_wide_wood, Box_wood
- Cargo_1_close, Cargo_1_open, Cargo_2_empty, Cargo_2_full
- Liquid_reservoir_1, Liquid_reservoir_2
- Bags_1, Bags_2
- Generator
- Metal_cabinet_1, Metal_cabinet_2
- Palet_single, Palet_stack
- Roadblock

### Infrastructure
- Bridges_1, Bridges_2, Bridges_3, Bridges_end
- Bridges_stairs_1, Bridges_stairs_2, Bridges_turn
- Bridges_support_1, Bridges_support_2, Bridges_support_3
- Pipes_arch, Pipes_horizontal_long, Pipes_horizontal_short
- Pipes_horizontal_turn_1, Pipes_horizontal_turn_2
- Pipes_out_1, Pipes_out_2, Pipes_support
- Pipes_vertical_long, Pipes_vertical_short, Pipes_vertical_turn

### Ventilation
- Ventilation_1, Ventilation_2, Ventilation_2_blades
- Ventilation_3, Ventilation_3_blades

### Ground/Roads
- Alphalt_Floor
- Road_curved, Road_long, Road_short
- Road_turn_1, Road_turn_2, Road_turn_3
- Concrete_stairs
- Concrete_miniwall_long, Concrete_miniwall_short

### Walls/Fences
- Wall, Wall_column
- Wall_corner_1, Wall_corner_2, Wall_corner_3
- Fence, Fence_corner, Fence_long, Fence_short

## Key Insight
This GLB is an **asset kit** - all pieces are laid out separately for assembly.
The large bounding box (88 x 13 x 211 units) represents ALL pieces spread out,
not a pre-composed scene.

## Current Problem
- Player spawns at [0, 1.6, 30]
- Current walls are at ±35 units
- But model center is at [42.91, 6.17, 23.44]
- Player is likely spawning outside or at the edge of the actual geometry
