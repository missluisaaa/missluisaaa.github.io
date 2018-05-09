<script src=lib2.js></script>

<body bgcolor=black text=white link=white alink=white vlink=white>
<center>
<canvas id='canvas1' width=400 height=400></canvas>
</center>
</body>

<script id='my_vertex_shader' type='x-shader/x-vertex'>
   attribute vec3 aPos;
   varying   vec3 vPos;
   void main() {
      gl_Position = vec4(aPos, 1.);
      vPos = aPos;
   }
</script>

<script id='my_fragment_shader' type='x-shader/x-fragment'>
uniform float uTime;
varying vec3  vPos;
uniform mat4  uMat;

vec4 raySph(vec3 V,vec3 W,vec4 S) {// TRACE RAY
   vec3  P = S.xyz - V;            // TO SPHERE
   float b = dot(W, P);
   float d = b * b - dot(P, P) + S.w * S.w;
   float t = b - sqrt(d);
   return vec4(V + t*W, step(0.,d)*step(0.,t));
}

void main() {
   float f = 5.;                // FOCAL LENGTH
   vec3 color = vec3(0.,0.,.1); // BACKGD COLOR
   vec3 V = vec3(0., 0., f);    // CREATE RAY
   vec3 W = normalize(vec3(vPos.xy, -f));
   vec4 S = vec4(0.,0.,0.,.5); // DEFINE SPHERE

   vec3 C = S.xyz;           // SEPARATE CENTER
   float r = S.w;                 // AND RADIUS
   C = (uMat * vec4(C, 1.)).xyz;  // APPLY uMat

   vec4 P = raySph(V,W,vec4(C,r));// SHOOT RAY:
   if (P.w > 0.) {                // IF IT HITS
      vec3 N = (P.xyz - C) / r;   // DO SHADING
      vec3 L = normalize(vec3(1.,1.,1.));
      float c = .1 + .9 * max(0., dot(N, L));
      color = vec3(c, c*c, c*c*c);
   }
   gl_FragColor = vec4(sqrt(color), 1.0);
}</script>

<script id='instructions' type='text/html'><font color=#b0b0b0>
<b>Description</b>
<p>
Remember to describe what you are
trying to do.
</script>
   
<script>
var vs = my_vertex_shader.innerHTML,
    fs = my_fragment_shader.innerHTML;
    fs = fs.substring(1, fs.length);

document.body.innerHTML = [''
   ,'<center><font size=6 color=#ffb3b3> Homework 4: Matrix Transformation</center>'
   ,'<TABLE cellspacing=0 cellpadding=0><TR>'
   ,'<td width=50></td><td><font color=red size=5><div id=errorMessage>&nbsp;</div></font></td>'
   ,'</TR><TR>'
   ,'<table cellspacing=10>'
   ,'<tr>'
   ,'<td valign=top><font size=2 color=red><div id=errorMarker>&nbsp;</div></font></td>'
   ,'<td valign=top>'
   ,'<textArea id=textArea spellcheck=false '
   ,'style="font:14px courier;outline-width:0;border-style:none;resize:none;overflow:scroll;"'
   ,'></textArea>'
   ,'</td><td valign=top>' + document.body.innerHTML + '</td>'
   ,'<td valign=top><font size=4>' + instructions.innerHTML + '</td>'
   ,'</tr></table>'
   ,'</TR></TABLE>'
   ].join('');

var i, text = fs.split('\n'), cols = 0;
for (i = 0 ; i < text.length ; i++)
   cols = Math.max(cols, text[i].length);

textArea.rows = text.length;
textArea.cols = cols;
textArea.value = fs;
textArea.style.backgroundColor = '#202020';
textArea.style.color = 'white';
textArea.onkeyup = function() { canvas1.setShaders(vs, this.value); }

var startTime = Date.now();

function animate(gl) {
   let time = (Date.now() - startTime) / 1000;
   setUniform('1f', 'uTime', time);

   // EXAMPLE OF SETTING UNIFORM SHADER VARIABLE uMat

   let z = 10 * Math.sin(2 * time);
   setUniform('Matrix4fv', 'uMat', false, [ 1, 0, 0, 0,
                                            0, 1, 0, 0,
              0, 0, 1, 0,
             .1, 0, z, 1]);
}

gl_start(canvas1, vs, fs);
</script>
