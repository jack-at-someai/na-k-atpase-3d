// cnn.js — Vec math, CNNLayer, CNNArchitecture, presets, forward pass simulation

class Vec {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    add(v) { return new Vec(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v) { return new Vec(this.x - v.x, this.y - v.y, this.z - v.z); }
    mul(s) { return new Vec(this.x * s, this.y * s, this.z * s); }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    cross(v) {
        return new Vec(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    norm() { const m = this.mag(); return m > 0 ? this.mul(1 / m) : new Vec(); }
    clone() { return new Vec(this.x, this.y, this.z); }
    lerp(v, t) { return this.add(v.sub(this).mul(t)); }
}

// --- Layer color definitions ---
const LAYER_COLORS = {
    input:   { r: 200, g: 200, b: 220 },
    conv:    { r: 110, g: 86,  b: 207 },
    pool:    { r: 0,   g: 212, b: 170 },
    flatten: { r: 240, g: 192, b: 64  },
    fc:      { r: 224, g: 128, b: 64  },
    output:  { r: 64,  g: 224, b: 128 }
};

// --- Activation functions ---
const ACTIVATIONS = {
    relu:    x => Math.max(0, x),
    sigmoid: x => 1 / (1 + Math.exp(-x)),
    tanh:    x => Math.tanh(x),
    none:    x => x
};

// --- CNNLayer ---
class CNNLayer {
    constructor(type, config = {}) {
        this.type = type; // input | conv | pool | flatten | fc | output
        this.config = Object.assign({
            kernelSize: 3,
            filterCount: 4,
            stride: 1,
            padding: 0,
            poolSize: 2,
            poolType: 'max',
            neuronCount: 64,
            activation: 'relu'
        }, config);
        this.inputShape = { w: 0, h: 0, c: 0 };
        this.outputShape = { w: 0, h: 0, c: 0 };
        this.position3D = new Vec();
        this.featureMapData = null;
        this.id = CNNLayer._nextId++;
    }

    computeOutputShape(inputShape) {
        this.inputShape = { ...inputShape };
        const { w, h, c } = inputShape;
        const cfg = this.config;

        switch (this.type) {
            case 'input':
                this.outputShape = { w, h, c: c || 1 };
                break;
            case 'conv': {
                const ow = Math.floor((w - cfg.kernelSize + 2 * cfg.padding) / cfg.stride) + 1;
                const oh = Math.floor((h - cfg.kernelSize + 2 * cfg.padding) / cfg.stride) + 1;
                this.outputShape = { w: Math.max(1, ow), h: Math.max(1, oh), c: cfg.filterCount };
                break;
            }
            case 'pool': {
                const ow = Math.floor(w / cfg.poolSize);
                const oh = Math.floor(h / cfg.poolSize);
                this.outputShape = { w: Math.max(1, ow), h: Math.max(1, oh), c };
                break;
            }
            case 'flatten':
                this.outputShape = { w: 1, h: 1, c: w * h * c };
                break;
            case 'fc':
                this.outputShape = { w: 1, h: 1, c: cfg.neuronCount };
                break;
            case 'output':
                this.outputShape = { w: 1, h: 1, c: cfg.neuronCount || 10 };
                break;
        }
        return this.outputShape;
    }

    getColor() { return LAYER_COLORS[this.type] || LAYER_COLORS.input; }

    getLabel() {
        const s = this.outputShape;
        switch (this.type) {
            case 'input':   return `Input ${s.w}x${s.h}x${s.c}`;
            case 'conv':    return `Conv ${this.config.kernelSize}x${this.config.kernelSize} → ${s.w}x${s.h}x${s.c}`;
            case 'pool':    return `Pool ${this.config.poolSize}x${this.config.poolSize} → ${s.w}x${s.h}x${s.c}`;
            case 'flatten': return `Flatten → ${s.c}`;
            case 'fc':      return `FC → ${s.c}`;
            case 'output':  return `Output → ${s.c}`;
        }
    }

    getShortLabel() {
        switch (this.type) {
            case 'input':   return 'Input';
            case 'conv':    return `Conv ${this.config.kernelSize}x${this.config.kernelSize}`;
            case 'pool':    return `Pool ${this.config.poolSize}x${this.config.poolSize}`;
            case 'flatten': return 'Flatten';
            case 'fc':      return `FC-${this.config.neuronCount}`;
            case 'output':  return `Out-${this.config.neuronCount || 10}`;
        }
    }

    getDimsLabel() {
        const s = this.outputShape;
        if (this.type === 'flatten' || this.type === 'fc' || this.type === 'output') return `${s.c}`;
        return `${s.w}x${s.h}x${s.c}`;
    }
}
CNNLayer._nextId = 0;

// --- CNNArchitecture ---
class CNNArchitecture {
    constructor() {
        this.layers = [];
        this.inputSize = 16;
    }

    addLayer(type, config) {
        this.layers.push(new CNNLayer(type, config));
        this.computeShapes();
        return this;
    }

    removeLastLayer() {
        if (this.layers.length > 1) {
            this.layers.pop();
            this.computeShapes();
        }
    }

    computeShapes() {
        let shape = { w: this.inputSize, h: this.inputSize, c: 1 };
        for (const layer of this.layers) {
            shape = layer.computeOutputShape(shape);
        }
    }

    computeLayout(spacing = 120) {
        const n = this.layers.length;
        const totalWidth = (n - 1) * spacing;
        const startX = -totalWidth / 2;
        for (let i = 0; i < n; i++) {
            const layer = this.layers[i];
            layer.position3D = new Vec(startX + i * spacing, 0, 0);
        }
    }

    simulateForwardPass(inputData) {
        let data = inputData;
        for (const layer of this.layers) {
            data = this._processLayer(layer, data);
            layer.featureMapData = data;
        }
    }

    _processLayer(layer, input) {
        const cfg = layer.config;
        const inShape = layer.inputShape;
        const outShape = layer.outputShape;

        switch (layer.type) {
            case 'input':
                return this._ensureShape(input, outShape);
            case 'conv':
                return this._convolution(input, inShape, outShape, cfg);
            case 'pool':
                return this._pooling(input, inShape, outShape, cfg);
            case 'flatten':
                return this._flatten(input);
            case 'fc':
                return this._fullyConnected(input, outShape, cfg);
            case 'output':
                return this._fullyConnected(input, outShape, cfg);
            default:
                return input;
        }
    }

    _ensureShape(data, shape) {
        const needed = shape.w * shape.h * shape.c;
        if (!data || data.length !== needed) {
            const arr = new Float32Array(needed);
            if (data) {
                for (let i = 0; i < Math.min(data.length, needed); i++) arr[i] = data[i];
            }
            return arr;
        }
        return data;
    }

    _convolution(input, inShape, outShape, cfg) {
        const out = new Float32Array(outShape.w * outShape.h * outShape.c);
        const activation = ACTIVATIONS[cfg.activation] || ACTIVATIONS.relu;
        const kSize = cfg.kernelSize;

        // Simple deterministic kernel weights based on filter index
        for (let f = 0; f < outShape.c; f++) {
            for (let oy = 0; oy < outShape.h; oy++) {
                for (let ox = 0; ox < outShape.w; ox++) {
                    let sum = 0;
                    const iy0 = oy * cfg.stride - cfg.padding;
                    const ix0 = ox * cfg.stride - cfg.padding;
                    for (let ic = 0; ic < inShape.c; ic++) {
                        for (let ky = 0; ky < kSize; ky++) {
                            for (let kx = 0; kx < kSize; kx++) {
                                const iy = iy0 + ky;
                                const ix = ix0 + kx;
                                if (iy >= 0 && iy < inShape.h && ix >= 0 && ix < inShape.w) {
                                    const inIdx = ic * inShape.w * inShape.h + iy * inShape.w + ix;
                                    // Deterministic kernels: edge detectors, blurs, etc.
                                    const weight = this._kernelWeight(f, ky, kx, kSize);
                                    sum += (input[inIdx] || 0) * weight;
                                }
                            }
                        }
                    }
                    const outIdx = f * outShape.w * outShape.h + oy * outShape.w + ox;
                    out[outIdx] = activation(sum);
                }
            }
        }
        return out;
    }

    _kernelWeight(filterIdx, ky, kx, kSize) {
        const mid = Math.floor(kSize / 2);
        switch (filterIdx % 4) {
            case 0: // Horizontal edge
                return ky < mid ? -1 : (ky > mid ? 1 : 0);
            case 1: // Vertical edge
                return kx < mid ? -1 : (kx > mid ? 1 : 0);
            case 2: // Diagonal
                return (kx === ky) ? 1 : -0.25;
            case 3: // Blur
                return 1 / (kSize * kSize);
            default: return 0;
        }
    }

    _pooling(input, inShape, outShape, cfg) {
        const out = new Float32Array(outShape.w * outShape.h * outShape.c);
        for (let c = 0; c < outShape.c; c++) {
            for (let oy = 0; oy < outShape.h; oy++) {
                for (let ox = 0; ox < outShape.w; ox++) {
                    let val = cfg.poolType === 'max' ? -Infinity : 0;
                    let count = 0;
                    for (let py = 0; py < cfg.poolSize; py++) {
                        for (let px = 0; px < cfg.poolSize; px++) {
                            const iy = oy * cfg.poolSize + py;
                            const ix = ox * cfg.poolSize + px;
                            if (iy < inShape.h && ix < inShape.w) {
                                const inIdx = c * inShape.w * inShape.h + iy * inShape.w + ix;
                                const v = input[inIdx] || 0;
                                if (cfg.poolType === 'max') {
                                    val = Math.max(val, v);
                                } else {
                                    val += v;
                                }
                                count++;
                            }
                        }
                    }
                    if (cfg.poolType === 'avg' && count > 0) val /= count;
                    if (val === -Infinity) val = 0;
                    out[c * outShape.w * outShape.h + oy * outShape.w + ox] = val;
                }
            }
        }
        return out;
    }

    _flatten(input) {
        return new Float32Array(input);
    }

    _fullyConnected(input, outShape, cfg) {
        const out = new Float32Array(outShape.c);
        const activation = ACTIVATIONS[cfg.activation] || ACTIVATIONS.relu;
        const inLen = input.length;
        // Simple pseudo-random but deterministic weights
        for (let o = 0; o < outShape.c; o++) {
            let sum = 0;
            for (let i = 0; i < inLen; i++) {
                const w = Math.sin((o * 31 + i * 17) * 0.1) * 0.5;
                sum += (input[i] || 0) * w;
            }
            out[o] = activation(sum / Math.max(1, Math.sqrt(inLen)));
        }
        return out;
    }
}

// --- Procedural Input Patterns (16x16) ---
function generateInputPattern(type, size = 16) {
    const data = new Float32Array(size * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = y * size + x;
            switch (type) {
                case 'checkerboard':
                    data[idx] = ((x + y) % 2 === 0) ? 1 : 0;
                    break;
                case 'h-stripes':
                    data[idx] = (y % 4 < 2) ? 1 : 0;
                    break;
                case 'v-stripes':
                    data[idx] = (x % 4 < 2) ? 1 : 0;
                    break;
                case 'diagonal':
                    data[idx] = ((x + y) % 6 < 3) ? 1 : 0;
                    break;
                case 'circle': {
                    const cx = size / 2 - 0.5, cy = size / 2 - 0.5;
                    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                    data[idx] = dist < size * 0.35 ? 1 : 0;
                    break;
                }
                case 'noise':
                    // Deterministic pseudo-random
                    data[idx] = ((Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1 + 1) % 1;
                    break;
            }
        }
    }
    return data;
}

const INPUT_PATTERNS = ['checkerboard', 'h-stripes', 'v-stripes', 'diagonal', 'circle', 'noise'];

// --- Presets ---
function createPreset(name) {
    const arch = new CNNArchitecture();
    switch (name) {
        case 'simple':
            arch.inputSize = 16;
            arch.addLayer('input', {});
            arch.addLayer('conv', { kernelSize: 3, filterCount: 4, stride: 1, padding: 0 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('flatten', {});
            arch.addLayer('fc', { neuronCount: 32 });
            arch.addLayer('output', { neuronCount: 10 });
            break;
        case 'lenet5':
            arch.inputSize = 28;
            arch.addLayer('input', {});
            arch.addLayer('conv', { kernelSize: 5, filterCount: 6, stride: 1, padding: 0 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('conv', { kernelSize: 5, filterCount: 16, stride: 1, padding: 0 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('flatten', {});
            arch.addLayer('fc', { neuronCount: 120 });
            arch.addLayer('fc', { neuronCount: 84 });
            arch.addLayer('output', { neuronCount: 10 });
            break;
        case 'alexnet-mini':
            arch.inputSize = 32;
            arch.addLayer('input', {});
            arch.addLayer('conv', { kernelSize: 3, filterCount: 16, stride: 1, padding: 1 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('conv', { kernelSize: 3, filterCount: 32, stride: 1, padding: 1 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('conv', { kernelSize: 3, filterCount: 64, stride: 1, padding: 1 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('flatten', {});
            arch.addLayer('fc', { neuronCount: 256 });
            arch.addLayer('fc', { neuronCount: 128 });
            arch.addLayer('output', { neuronCount: 10 });
            break;
        case 'custom':
            arch.inputSize = 16;
            arch.addLayer('input', {});
            arch.addLayer('conv', { kernelSize: 3, filterCount: 4, stride: 1, padding: 0 });
            arch.addLayer('pool', { poolSize: 2 });
            arch.addLayer('flatten', {});
            arch.addLayer('fc', { neuronCount: 32 });
            arch.addLayer('output', { neuronCount: 10 });
            break;
    }
    arch.computeShapes();
    arch.computeLayout();
    return arch;
}

// --- Layer educational info ---
const LAYER_INFO = {
    input: {
        title: 'Input Layer',
        description: 'The input layer receives raw pixel data. For grayscale images, each pixel is a single value between 0 and 1. Color images have 3 channels (RGB).',
        formula: 'Output = Input (pass-through)',
        insight: 'Normalizing pixel values to [0,1] helps the network learn faster and more stably.',
        diagram: 'grid' // type of mini diagram to draw
    },
    conv: {
        title: 'Convolutional Layer',
        description: 'A small kernel (filter) slides across the input, computing dot products at each position. Each filter learns to detect a specific feature like edges, corners, or textures.',
        formula: 'out[x,y] = sum(input[x+i,y+j] * kernel[i,j]) + bias\nOutput size = floor((W - K + 2P) / S) + 1',
        insight: 'Weight sharing means the same kernel is applied everywhere, drastically reducing parameters compared to fully-connected layers.',
        diagram: 'kernel'
    },
    pool: {
        title: 'Pooling Layer',
        description: 'Reduces spatial dimensions by summarizing patches of the feature map. Max pooling takes the maximum value in each patch, preserving the strongest activations.',
        formula: 'Max Pool: out[x,y] = max(input[x*s..x*s+p, y*s..y*s+p])\nOutput size = floor(W / P)',
        insight: 'Pooling provides translation invariance — the network recognizes features regardless of their exact position.',
        diagram: 'pool'
    },
    flatten: {
        title: 'Flatten Layer',
        description: 'Reshapes the 3D feature maps (width x height x channels) into a 1D vector, bridging spatial feature extraction and classification layers.',
        formula: 'Output length = W * H * C',
        insight: 'This is where the network transitions from "where is the feature?" to "what combination of features are present?"',
        diagram: 'flatten'
    },
    fc: {
        title: 'Fully Connected Layer',
        description: 'Every neuron connects to all neurons in the previous layer. These layers combine features detected by convolutions to make high-level decisions.',
        formula: 'out[j] = activation(sum(input[i] * W[i,j]) + bias[j])',
        insight: 'FC layers have the most parameters in a CNN. Modern architectures try to minimize them using global average pooling.',
        diagram: 'fc'
    },
    output: {
        title: 'Output Layer',
        description: 'Produces final predictions. For classification, each neuron represents a class, and softmax converts raw scores into probabilities.',
        formula: 'softmax(x[i]) = exp(x[i]) / sum(exp(x[j]))',
        insight: 'The number of output neurons equals the number of classes. The highest probability indicates the predicted class.',
        diagram: 'output'
    }
};
