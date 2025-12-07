/**
 * GLB File Analyzer - Deep diagnostic tool for understanding GLB structure
 * Run with: node debug/analyze-glb.mjs
 */

import { NodeIO } from '@gltf-transform/core';
import { readFileSync } from 'fs';
import { join, basename } from 'path';

const FILE_PATH = process.argv[2] || './World 1_collider.glb';

async function analyzeGLB(filePath) {
  console.log('═'.repeat(70));
  console.log(`  GLB ANALYSIS: ${basename(filePath)}`);
  console.log('═'.repeat(70));
  
  // Get file size
  const fileBuffer = readFileSync(filePath);
  const fileSizeKB = (fileBuffer.byteLength / 1024).toFixed(2);
  const fileSizeMB = (fileBuffer.byteLength / (1024 * 1024)).toFixed(2);
  
  console.log(`\n📁 FILE INFO`);
  console.log(`   Path: ${filePath}`);
  console.log(`   Size: ${fileSizeKB} KB (${fileSizeMB} MB)`);
  
  // Parse with gltf-transform
  const io = new NodeIO();
  const document = await io.read(filePath);
  const root = document.getRoot();
  
  // ===== SCENE STRUCTURE =====
  const scenes = root.listScenes();
  const nodes = root.listNodes();
  const meshes = root.listMeshes();
  const materials = root.listMaterials();
  const textures = root.listTextures();
  const animations = root.listAnimations();
  const skins = root.listSkins();
  const cameras = root.listCameras();
  
  console.log(`\n📊 SCENE STRUCTURE`);
  console.log(`   Scenes: ${scenes.length}`);
  console.log(`   Nodes (objects): ${nodes.length}`);
  console.log(`   Meshes: ${meshes.length}`);
  console.log(`   Materials: ${materials.length}`);
  console.log(`   Textures: ${textures.length}`);
  console.log(`   Animations: ${animations.length}`);
  console.log(`   Skins: ${skins.length}`);
  console.log(`   Cameras: ${cameras.length}`);
  
  // ===== BOUNDING BOX CALCULATION =====
  console.log(`\n📐 DIMENSIONS & BOUNDS`);
  
  let globalMin = [Infinity, Infinity, Infinity];
  let globalMax = [-Infinity, -Infinity, -Infinity];
  let totalVertices = 0;
  let totalTriangles = 0;
  
  // Process each mesh to get bounds
  meshes.forEach((mesh, idx) => {
    const primitives = mesh.listPrimitives();
    primitives.forEach(prim => {
      const positionAccessor = prim.getAttribute('POSITION');
      if (positionAccessor) {
        const positions = positionAccessor.getArray();
        const count = positionAccessor.getCount();
        totalVertices += count;
        
        // Get min/max from accessor
        const min = positionAccessor.getMin([]);
        const max = positionAccessor.getMax([]);
        
        if (min && max) {
          for (let i = 0; i < 3; i++) {
            globalMin[i] = Math.min(globalMin[i], min[i]);
            globalMax[i] = Math.max(globalMax[i], max[i]);
          }
        }
        
        // Count triangles
        const indices = prim.getIndices();
        if (indices) {
          totalTriangles += indices.getCount() / 3;
        } else {
          totalTriangles += count / 3;
        }
      }
    });
  });
  
  const width = globalMax[0] - globalMin[0];
  const height = globalMax[1] - globalMin[1];
  const depth = globalMax[2] - globalMin[2];
  const center = [
    (globalMin[0] + globalMax[0]) / 2,
    (globalMin[1] + globalMax[1]) / 2,
    (globalMin[2] + globalMax[2]) / 2
  ];
  
  console.log(`   Bounding Box Min: [${globalMin.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`   Bounding Box Max: [${globalMax.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`   Dimensions (W×H×D): ${width.toFixed(3)} × ${height.toFixed(3)} × ${depth.toFixed(3)}`);
  console.log(`   Center Point: [${center.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`   Total Vertices: ${totalVertices.toLocaleString()}`);
  console.log(`   Total Triangles: ${Math.floor(totalTriangles).toLocaleString()}`);
  
  // ===== NODE HIERARCHY =====
  console.log(`\n🌳 NODE HIERARCHY`);
  
  function printNodeTree(node, indent = 0) {
    const prefix = '   ' + '  '.repeat(indent);
    const name = node.getName() || '(unnamed)';
    const mesh = node.getMesh();
    const translation = node.getTranslation();
    const rotation = node.getRotation();
    const scale = node.getScale();
    
    let info = `${prefix}├─ ${name}`;
    if (mesh) {
      const primCount = mesh.listPrimitives().length;
      info += ` [Mesh: ${primCount} primitive(s)]`;
    }
    console.log(info);
    
    // Show transform if non-default
    const hasTranslation = translation.some(v => Math.abs(v) > 0.001);
    const hasRotation = rotation.some((v, i) => i < 3 ? Math.abs(v) > 0.001 : Math.abs(v - 1) > 0.001);
    const hasScale = scale.some(v => Math.abs(v - 1) > 0.001);
    
    if (hasTranslation || hasRotation || hasScale) {
      if (hasTranslation) {
        console.log(`${prefix}   pos: [${translation.map(v => v.toFixed(2)).join(', ')}]`);
      }
      if (hasRotation) {
        console.log(`${prefix}   rot: [${rotation.map(v => v.toFixed(3)).join(', ')}]`);
      }
      if (hasScale) {
        console.log(`${prefix}   scale: [${scale.map(v => v.toFixed(2)).join(', ')}]`);
      }
    }
    
    node.listChildren().forEach(child => printNodeTree(child, indent + 1));
  }
  
  scenes.forEach((scene, idx) => {
    console.log(`   Scene ${idx}: ${scene.getName() || '(default)'}`);
    scene.listChildren().forEach(node => printNodeTree(node, 1));
  });
  
  // ===== MESH DETAILS =====
  console.log(`\n🔷 MESH DETAILS`);
  
  meshes.forEach((mesh, idx) => {
    const name = mesh.getName() || `Mesh_${idx}`;
    const primitives = mesh.listPrimitives();
    
    console.log(`\n   [${idx}] ${name}`);
    
    primitives.forEach((prim, primIdx) => {
      const attributes = prim.listSemantics();
      const material = prim.getMaterial();
      const indices = prim.getIndices();
      const posAccessor = prim.getAttribute('POSITION');
      
      let vertCount = posAccessor ? posAccessor.getCount() : 0;
      let triCount = indices ? indices.getCount() / 3 : vertCount / 3;
      
      console.log(`       Primitive ${primIdx}:`);
      console.log(`         Vertices: ${vertCount}, Triangles: ${Math.floor(triCount)}`);
      console.log(`         Attributes: ${attributes.join(', ')}`);
      console.log(`         Material: ${material ? (material.getName() || 'unnamed') : 'none'}`);
      
      // Per-primitive bounds
      if (posAccessor) {
        const min = posAccessor.getMin([]);
        const max = posAccessor.getMax([]);
        if (min && max) {
          const size = [max[0]-min[0], max[1]-min[1], max[2]-min[2]];
          console.log(`         Local Bounds: ${size.map(v => v.toFixed(2)).join(' × ')}`);
        }
      }
    });
  });
  
  // ===== MATERIALS =====
  if (materials.length > 0) {
    console.log(`\n🎨 MATERIALS`);
    materials.forEach((mat, idx) => {
      const name = mat.getName() || `Material_${idx}`;
      const baseColor = mat.getBaseColorFactor();
      const metallic = mat.getMetallicFactor();
      const roughness = mat.getRoughnessFactor();
      const emissive = mat.getEmissiveFactor();
      const alphaMode = mat.getAlphaMode();
      const doubleSided = mat.getDoubleSided();
      
      console.log(`   [${idx}] ${name}`);
      console.log(`       Base Color: rgba(${baseColor.map(v => (v*255).toFixed(0)).join(', ')})`);
      console.log(`       Metallic: ${metallic.toFixed(2)}, Roughness: ${roughness.toFixed(2)}`);
      if (emissive.some(v => v > 0)) {
        console.log(`       Emissive: rgb(${emissive.map(v => v.toFixed(2)).join(', ')})`);
      }
      console.log(`       Alpha Mode: ${alphaMode}, Double Sided: ${doubleSided}`);
      
      // Check for textures
      const baseColorTex = mat.getBaseColorTexture();
      const normalTex = mat.getNormalTexture();
      const metallicRoughnessTex = mat.getMetallicRoughnessTexture();
      const emissiveTex = mat.getEmissiveTexture();
      const occlusionTex = mat.getOcclusionTexture();
      
      const textures = [];
      if (baseColorTex) textures.push('baseColor');
      if (normalTex) textures.push('normal');
      if (metallicRoughnessTex) textures.push('metallicRoughness');
      if (emissiveTex) textures.push('emissive');
      if (occlusionTex) textures.push('occlusion');
      
      if (textures.length > 0) {
        console.log(`       Textures: ${textures.join(', ')}`);
      }
    });
  }
  
  // ===== TEXTURES =====
  if (textures.length > 0) {
    console.log(`\n🖼️  TEXTURES`);
    textures.forEach((tex, idx) => {
      const name = tex.getName() || `Texture_${idx}`;
      const mimeType = tex.getMimeType();
      const image = tex.getImage();
      const size = tex.getSize();
      const imageSize = image ? (image.byteLength / 1024).toFixed(2) + ' KB' : 'N/A';
      
      console.log(`   [${idx}] ${name}`);
      console.log(`       Type: ${mimeType}, Size: ${size ? `${size[0]}×${size[1]}` : 'unknown'}, Data: ${imageSize}`);
    });
  }
  
  // ===== ANIMATIONS =====
  if (animations.length > 0) {
    console.log(`\n🎬 ANIMATIONS`);
    animations.forEach((anim, idx) => {
      const name = anim.getName() || `Animation_${idx}`;
      const channels = anim.listChannels();
      const samplers = anim.listSamplers();
      
      console.log(`   [${idx}] ${name}`);
      console.log(`       Channels: ${channels.length}, Samplers: ${samplers.length}`);
      
      channels.forEach((channel, chIdx) => {
        const targetNode = channel.getTargetNode();
        const targetPath = channel.getTargetPath();
        console.log(`       Channel ${chIdx}: ${targetNode?.getName() || 'unknown'} -> ${targetPath}`);
      });
    });
  }
  
  // ===== RECOMMENDATIONS =====
  console.log(`\n💡 RECOMMENDATIONS FOR THREE.JS/R3F`);
  console.log('─'.repeat(70));
  
  // Position recommendation
  if (Math.abs(center[0]) > 1 || Math.abs(center[2]) > 1) {
    console.log(`   ⚠️  Model is not centered. Consider offsetting position by:`);
    console.log(`      position={[${(-center[0]).toFixed(2)}, ${(-center[1]).toFixed(2)}, ${(-center[2]).toFixed(2)}]}`);
  } else {
    console.log(`   ✅ Model is roughly centered at origin`);
  }
  
  // Scale recommendation
  const maxDim = Math.max(width, height, depth);
  if (maxDim > 100) {
    const suggestedScale = (50 / maxDim).toFixed(4);
    console.log(`   ⚠️  Model is large (${maxDim.toFixed(1)} units). Consider scaling down:`);
    console.log(`      scale={${suggestedScale}}`);
  } else if (maxDim < 1) {
    const suggestedScale = (10 / maxDim).toFixed(2);
    console.log(`   ⚠️  Model is small (${maxDim.toFixed(3)} units). Consider scaling up:`);
    console.log(`      scale={${suggestedScale}}`);
  } else {
    console.log(`   ✅ Model scale seems reasonable (${maxDim.toFixed(2)} units max dimension)`);
  }
  
  // Ground level
  if (globalMin[1] < -0.1) {
    console.log(`   ⚠️  Model extends below Y=0 (min Y: ${globalMin[1].toFixed(2)})`);
    console.log(`      You may need to offset: position={[0, ${(-globalMin[1]).toFixed(2)}, 0]}`);
  } else if (globalMin[1] > 0.5) {
    console.log(`   ⚠️  Model floor is above Y=0 (min Y: ${globalMin[1].toFixed(2)})`);
  } else {
    console.log(`   ✅ Model floor is near Y=0`);
  }
  
  // Collision recommendation  
  console.log(`\n   📦 For physics colliders (Rapier):`);
  console.log(`      <CuboidCollider args={[${(width/2).toFixed(2)}, ${(height/2).toFixed(2)}, ${(depth/2).toFixed(2)}]} />`);
  console.log(`      Or use trimesh for accurate collision:`);
  console.log(`      <RigidBody type="fixed" colliders="trimesh">`);
  
  // Performance
  console.log(`\n   ⚡ Performance Notes:`);
  if (totalTriangles > 100000) {
    console.log(`      ⚠️  High poly count (${Math.floor(totalTriangles).toLocaleString()} tris) - consider LOD or decimation`);
  } else {
    console.log(`      ✅ Poly count is manageable (${Math.floor(totalTriangles).toLocaleString()} tris)`);
  }
  
  if (textures.length > 8) {
    console.log(`      ⚠️  Many textures (${textures.length}) - watch for draw calls`);
  }
  
  console.log('\n' + '═'.repeat(70));
  console.log('  ANALYSIS COMPLETE');
  console.log('═'.repeat(70) + '\n');
}

// Run analysis
analyzeGLB(FILE_PATH).catch(err => {
  console.error('Error analyzing GLB:', err.message);
  process.exit(1);
});
