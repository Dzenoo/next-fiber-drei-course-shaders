uniform float uTime;

uniform sampler2D uPerlinTexture;

varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main() {
    vec3 newPosition = position;

    float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.3 - uTime * 0.005)).r;

    float angle = twistPerlin * 10.0;

    newPosition.xz = rotate2D(newPosition.xz, angle);

    vec2 windOffset = vec2(texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5, texture(uPerlinTexture, vec2(0.35, uTime * 0.01)).r - 0.5);

    windOffset *= pow(uv.y, 3.0) * 10.0;

    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
}