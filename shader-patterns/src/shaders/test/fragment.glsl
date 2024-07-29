varying vec2 vUv;

void main()
{
    // float strenght = vUv.y;
    float strenght = step(0.8, mod(vUv.y * 10.0, 1.0));
    strenght *= step(0.8, mod(vUv.x * 10.0, 1.0));
    gl_FragColor = vec4(strenght, strenght, strenght, 1.0);
}