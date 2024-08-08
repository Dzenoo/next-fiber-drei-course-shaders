uniform vec3 uColor;

uniform sampler2D uTexture;

void main() {

    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    gl_FragColor = vec4(uColor, textureAlpha);

    #include <tonemapping_fragment>

    #include <colorspace_fragment>
}