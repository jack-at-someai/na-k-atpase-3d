/**
 * Constellation — 3D Force-Directed Knowledge Graph
 * Three.js + custom force simulation
 */
class ConstellationGraph {
  constructor(container) {
    this.container = container;
    this.nodes = [];
    this.edges = [];
    this.nodeMap = {};
    this.nodeMeshes = {};
    this.edgeLines = {};
    this.labelSprites = {};
    this.selectedNode = null;
    this.hoveredNode = null;
    this.activatedNodes = new Set();
    this.traversalTrails = [];
    this.dimmedClusters = new Set();

    this._initScene();
    this._initStarfield();
    this._initRaycaster();
    this._animate();

    window.addEventListener('resize', () => this._onResize());
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000008, 0.0008);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.set(0, 100, 400);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000008, 1);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.3;

    // Ambient light
    const ambient = new THREE.AmbientLight(0x222233, 0.5);
    this.scene.add(ambient);

    // Point light at center
    const pointLight = new THREE.PointLight(0x22d3ee, 0.8, 800);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
  }

  _initStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 1500 + Math.random() * 3000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.7;
      colors[i3] = brightness * (0.8 + Math.random() * 0.2);
      colors[i3 + 1] = brightness * (0.85 + Math.random() * 0.15);
      colors[i3 + 2] = brightness;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    this.starfield = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.starfield);
  }

  _initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points = { threshold: 5 };
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    this.renderer.domElement.addEventListener('click', (e) => {
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode);
      }
    });
  }

  loadGraph(data) {
    this.graphData = data;
    this.nodes = data.nodes.map(n => ({
      ...n,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 300,
      vx: 0, vy: 0, vz: 0
    }));
    this.edges = data.edges;

    this.nodeMap = {};
    this.nodes.forEach(n => { this.nodeMap[n.id] = n; });

    this._createNodeMeshes();
    this._createEdgeLines();
    this._simulateForces(200);

    document.getElementById('node-count').textContent = this.nodes.length;
    document.getElementById('edge-count').textContent = this.edges.length;
  }

  _createNodeMeshes() {
    // Remove old meshes
    Object.values(this.nodeMeshes).forEach(m => this.scene.remove(m));
    Object.values(this.labelSprites).forEach(s => this.scene.remove(s));
    this.nodeMeshes = {};
    this.labelSprites = {};

    // Node geometry pool
    this.nodes.forEach(node => {
      const size = node.size || 3;
      const color = new THREE.Color(node.color || '#ffffff');

      // Core sphere
      const geometry = new THREE.SphereGeometry(size * 0.6, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { nodeId: node.id };
      mesh.position.set(node.x, node.y, node.z);
      this.scene.add(mesh);
      this.nodeMeshes[node.id] = mesh;

      // Glow sprite
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = 64;
      glowCanvas.height = 64;
      const ctx = glowCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, `rgba(${color.r*255},${color.g*255},${color.b*255},0.4)`);
      gradient.addColorStop(0.4, `rgba(${color.r*255},${color.g*255},${color.b*255},0.1)`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const glowTexture = new THREE.CanvasTexture(glowCanvas);
      const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false });
      const glow = new THREE.Sprite(glowMaterial);
      glow.scale.set(size * 4, size * 4, 1);
      mesh.add(glow);

      // Label as canvas sprite
      const labelSprite = this._createLabel(node.label, node.color || '#ffffff');
      labelSprite.position.set(0, size * 1.5 + 4, 0);
      mesh.add(labelSprite);
      this.labelSprites[node.id] = labelSprite;
    });
  }

  _createEdgeLines() {
    Object.values(this.edgeLines).forEach(l => this.scene.remove(l));
    this.edgeLines = {};

    this.edges.forEach((edge, i) => {
      const sourceNode = this.nodeMap[edge.source];
      const targetNode = this.nodeMap[edge.target];
      if (!sourceNode || !targetNode) return;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const sourceColor = new THREE.Color(sourceNode.color || '#ffffff');
      const targetColor = new THREE.Color(targetNode.color || '#ffffff');
      const midColor = sourceColor.clone().lerp(targetColor, 0.5);

      const material = new THREE.LineBasicMaterial({
        color: midColor,
        transparent: true,
        opacity: 0.15,
        depthWrite: false
      });

      const line = new THREE.Line(geometry, material);
      line.userData = { edgeIndex: i, source: edge.source, target: edge.target };
      this.scene.add(line);
      this.edgeLines[`${edge.source}-${edge.target}`] = line;
    });
  }

  _simulateForces(iterations) {
    const alpha = 0.3;
    const repulsion = 5000;
    const attraction = 0.005;
    const centerGravity = 0.01;
    const clusterGravity = 0.02;

    // Compute cluster centers
    const clusterPositions = {};
    const clusterCounts = {};
    const clusterIndex = {};
    const clusterNames = [...new Set(this.nodes.map(n => n.cluster))];
    clusterNames.forEach((c, i) => {
      const angle = (i / clusterNames.length) * Math.PI * 2;
      const radius = 80;
      clusterPositions[c] = {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 60,
        z: Math.sin(angle) * radius
      };
      clusterCounts[c] = 0;
      clusterIndex[c] = i;
    });

    for (let iter = 0; iter < iterations; iter++) {
      const t = 1 - iter / iterations;

      // Repulsion between all nodes
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i];
          const b = this.nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
          const force = (repulsion * t) / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          const fz = (dz / dist) * force;
          a.vx += fx; a.vy += fy; a.vz += fz;
          b.vx -= fx; b.vy -= fy; b.vz -= fz;
        }
      }

      // Attraction along edges
      this.edges.forEach(edge => {
        const a = this.nodeMap[edge.source];
        const b = this.nodeMap[edge.target];
        if (!a || !b) return;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
        const force = dist * attraction * t;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        a.vx += fx; a.vy += fy; a.vz += fz;
        b.vx -= fx; b.vy -= fy; b.vz -= fz;
      });

      // Cluster gravity
      this.nodes.forEach(node => {
        const cp = clusterPositions[node.cluster];
        if (cp) {
          node.vx += (cp.x - node.x) * clusterGravity * t;
          node.vy += (cp.y - node.y) * clusterGravity * t;
          node.vz += (cp.z - node.z) * clusterGravity * t;
        }
      });

      // Center gravity
      this.nodes.forEach(node => {
        node.vx -= node.x * centerGravity * t;
        node.vy -= node.y * centerGravity * t;
        node.vz -= node.z * centerGravity * t;
      });

      // Apply velocities
      this.nodes.forEach(node => {
        const damping = 0.8;
        node.x += node.vx * alpha;
        node.y += node.vy * alpha;
        node.z += node.vz * alpha;
        node.vx *= damping;
        node.vy *= damping;
        node.vz *= damping;
      });
    }

    // Update mesh positions
    this._updatePositions();
  }

  _updatePositions() {
    this.nodes.forEach(node => {
      const mesh = this.nodeMeshes[node.id];
      if (mesh) {
        mesh.position.set(node.x, node.y, node.z);
      }
    });

    this.edges.forEach(edge => {
      const line = this.edgeLines[`${edge.source}-${edge.target}`];
      if (!line) return;
      const a = this.nodeMap[edge.source];
      const b = this.nodeMap[edge.target];
      if (!a || !b) return;

      const positions = line.geometry.attributes.position.array;
      positions[0] = a.x; positions[1] = a.y; positions[2] = a.z;
      positions[3] = b.x; positions[4] = b.y; positions[5] = b.z;
      line.geometry.attributes.position.needsUpdate = true;
    });
  }

  selectNode(nodeId) {
    const node = this.nodeMap[nodeId];
    if (!node) return;

    this.selectedNode = nodeId;

    // Highlight selected node
    Object.entries(this.nodeMeshes).forEach(([id, mesh]) => {
      const isSelected = id === nodeId;
      const isConnected = this.edges.some(e =>
        (e.source === nodeId && e.target === id) ||
        (e.target === nodeId && e.source === id)
      );
      mesh.material.opacity = isSelected ? 1 : isConnected ? 0.8 : 0.2;
      mesh.material.emissiveIntensity = isSelected ? 1.2 : isConnected ? 0.8 : 0.2;
    });

    // Highlight connected edges
    Object.entries(this.edgeLines).forEach(([key, line]) => {
      const [src, tgt] = key.split('-');
      const isConnected = src === nodeId || tgt === nodeId;
      line.material.opacity = isConnected ? 0.6 : 0.05;
    });

    // Move camera to focus
    const targetPos = new THREE.Vector3(node.x, node.y, node.z);
    const cameraOffset = new THREE.Vector3(60, 30, 60);
    const newCamPos = targetPos.clone().add(cameraOffset);

    this._animateCamera(newCamPos, targetPos);

    // Emit event for UI
    if (this.onNodeSelect) this.onNodeSelect(node);
  }

  deselectNode() {
    this.selectedNode = null;

    Object.values(this.nodeMeshes).forEach(mesh => {
      const node = this.nodeMap[mesh.userData.nodeId];
      const isDimmed = this.dimmedClusters.has(node?.cluster);
      mesh.material.opacity = isDimmed ? 0.1 : 0.9;
      mesh.material.emissiveIntensity = isDimmed ? 0.1 : 0.6;
    });

    Object.values(this.edgeLines).forEach(line => {
      line.material.opacity = 0.15;
    });

    if (this.onNodeDeselect) this.onNodeDeselect();
  }

  // Animate traversal path through the graph
  async animateTraversal(nodeIds, speed = 600) {
    this.activatedNodes.clear();
    this._clearTraversalTrails();

    // Reset all nodes dim
    Object.values(this.nodeMeshes).forEach(mesh => {
      mesh.material.opacity = 0.15;
      mesh.material.emissiveIntensity = 0.1;
    });
    Object.values(this.edgeLines).forEach(line => {
      line.material.opacity = 0.03;
    });

    // Sequentially activate each node
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId = nodeIds[i];
      const node = this.nodeMap[nodeId];
      if (!node) continue;

      this.activatedNodes.add(nodeId);

      // Pulse the node
      const mesh = this.nodeMeshes[nodeId];
      if (mesh) {
        mesh.material.opacity = 1;
        mesh.material.emissiveIntensity = 1.5;

        // Scale pop
        const origScale = mesh.scale.x;
        mesh.scale.setScalar(origScale * 1.8);
        setTimeout(() => mesh.scale.setScalar(origScale), speed * 0.6);
      }

      // Draw trail from previous node
      if (i > 0) {
        const prevId = nodeIds[i - 1];
        this._drawTraversalTrail(prevId, nodeId);

        // Light up edge if exists
        const edgeKey1 = `${prevId}-${nodeId}`;
        const edgeKey2 = `${nodeId}-${prevId}`;
        const line = this.edgeLines[edgeKey1] || this.edgeLines[edgeKey2];
        if (line) {
          line.material.opacity = 0.8;
          line.material.color = new THREE.Color('#22d3ee');
        }
      }

      // Camera follow
      if (node) {
        const targetPos = new THREE.Vector3(node.x, node.y, node.z);
        this.controls.target.lerp(targetPos, 0.3);
      }

      await new Promise(r => setTimeout(r, speed));
    }

    // After traversal, keep activated nodes bright
    setTimeout(() => {
      Object.entries(this.nodeMeshes).forEach(([id, mesh]) => {
        if (this.activatedNodes.has(id)) {
          mesh.material.opacity = 1;
          mesh.material.emissiveIntensity = 0.8;
        } else {
          mesh.material.opacity = 0.3;
          mesh.material.emissiveIntensity = 0.2;
        }
      });
    }, 300);
  }

  resetTraversal() {
    this.activatedNodes.clear();
    this._clearTraversalTrails();

    Object.values(this.nodeMeshes).forEach(mesh => {
      const node = this.nodeMap[mesh.userData.nodeId];
      const isDimmed = this.dimmedClusters.has(node?.cluster);
      mesh.material.opacity = isDimmed ? 0.1 : 0.9;
      mesh.material.emissiveIntensity = isDimmed ? 0.1 : 0.6;
    });

    Object.values(this.edgeLines).forEach(line => {
      line.material.opacity = 0.15;
    });
  }

  _drawTraversalTrail(fromId, toId) {
    const a = this.nodeMap[fromId];
    const b = this.nodeMap[toId];
    if (!a || !b) return;

    const points = [];
    const segments = 30;
    for (let t = 0; t <= 1; t += 1 / segments) {
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t + Math.sin(t * Math.PI) * 5;
      const z = a.z + (b.z - a.z) * t;
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const trail = new THREE.Line(geometry, material);
    this.scene.add(trail);
    this.traversalTrails.push(trail);
  }

  _clearTraversalTrails() {
    this.traversalTrails.forEach(t => this.scene.remove(t));
    this.traversalTrails = [];
  }

  toggleCluster(clusterName) {
    if (this.dimmedClusters.has(clusterName)) {
      this.dimmedClusters.delete(clusterName);
    } else {
      this.dimmedClusters.add(clusterName);
    }

    this.nodes.forEach(node => {
      const mesh = this.nodeMeshes[node.id];
      if (!mesh) return;
      const isDimmed = this.dimmedClusters.has(node.cluster);
      mesh.material.opacity = isDimmed ? 0.05 : 0.9;
      mesh.material.emissiveIntensity = isDimmed ? 0.02 : 0.6;
      mesh.visible = !isDimmed;
    });

    Object.entries(this.edgeLines).forEach(([key, line]) => {
      const [src, tgt] = key.split('-');
      const srcNode = this.nodeMap[src];
      const tgtNode = this.nodeMap[tgt];
      if (srcNode && tgtNode) {
        const visible = !this.dimmedClusters.has(srcNode.cluster) && !this.dimmedClusters.has(tgtNode.cluster);
        line.material.opacity = visible ? 0.15 : 0.02;
        line.visible = visible;
      }
    });

    return this.dimmedClusters.has(clusterName);
  }

  _createLabel(text, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 28;
    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width) + 16;
    const height = fontSize + 12;
    canvas.width = width;
    canvas.height = height;

    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(width / 8, height / 8, 1);
    return sprite;
  }

  _animateCamera(position, target) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const duration = 1000;
    const startTime = Date.now();

    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const e = ease(t);

      this.camera.position.lerpVectors(startPos, position, e);
      this.controls.target.lerpVectors(startTarget, target, e);

      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }

  _checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = Object.values(this.nodeMeshes);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const nodeId = intersects[0].object.userData.nodeId;
      if (this.hoveredNode !== nodeId) {
        this.hoveredNode = nodeId;
        document.body.style.cursor = 'pointer';

        // Highlight on hover
        if (!this.selectedNode) {
          const mesh = this.nodeMeshes[nodeId];
          if (mesh) mesh.material.emissiveIntensity = 1.0;
        }
      }
    } else {
      if (this.hoveredNode && !this.selectedNode) {
        const mesh = this.nodeMeshes[this.hoveredNode];
        if (mesh) mesh.material.emissiveIntensity = 0.6;
      }
      this.hoveredNode = null;
      document.body.style.cursor = 'default';
    }
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    this.controls.update();
    this._checkHover();

    // Gentle breathing for activated nodes
    const time = Date.now() * 0.001;
    this.activatedNodes.forEach(nodeId => {
      const mesh = this.nodeMeshes[nodeId];
      if (mesh) {
        mesh.material.emissiveIntensity = 0.8 + Math.sin(time * 2 + nodeId.length) * 0.3;
      }
    });

    // Slow starfield rotation
    if (this.starfield) {
      this.starfield.rotation.y += 0.00003;
    }

    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Get all neighbors of a node
  getNeighbors(nodeId) {
    const neighbors = [];
    this.edges.forEach(e => {
      if (e.source === nodeId) neighbors.push({ id: e.target, label: e.label, direction: 'outgoing' });
      if (e.target === nodeId) neighbors.push({ id: e.source, label: e.label, direction: 'incoming' });
    });
    return neighbors;
  }

  // Get shortest path between two nodes (BFS)
  findPath(fromId, toId) {
    const visited = new Set();
    const queue = [[fromId]];
    visited.add(fromId);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === toId) return path;

      const neighbors = this.getNeighbors(current);
      for (const n of neighbors) {
        if (!visited.has(n.id)) {
          visited.add(n.id);
          queue.push([...path, n.id]);
        }
      }
    }
    return null;
  }

  // Get subgraph related to a query (nodes matching keywords + their neighbors)
  querySubgraph(keywords) {
    const kw = keywords.map(k => k.toLowerCase());
    const matched = new Set();

    this.nodes.forEach(node => {
      const text = [
        node.label,
        node.type,
        node.cluster,
        JSON.stringify(node.properties || {})
      ].join(' ').toLowerCase();

      if (kw.some(k => text.includes(k))) {
        matched.add(node.id);
      }
    });

    // Add immediate neighbors
    const expanded = new Set(matched);
    matched.forEach(nodeId => {
      this.getNeighbors(nodeId).forEach(n => expanded.add(n.id));
    });

    return [...expanded];
  }
}
