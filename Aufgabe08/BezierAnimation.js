import {LitElement, html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';

export class BezierAnimation extends LitElement {
  static styles = css`
    #mysvg {
      display: block;
      width: 99%;
      height: auto;
      border: 5px solid var(--third-bkg-color);
      touch-action: none;
    }

    @media (max-aspect-ratio: 1/1) {

      #mysvg {
        width: 100%;
        height: auto;
      }

    }

    #mysvg path {
      stroke-width: 3;
      stroke: #000;
      stroke-linecap: round;
      fill: none;
    }

    #mysvg .control {
      stroke-width: 1;
      stroke: #c00;
      fill: #fff;
    }

    #mysvg .control:hover, #mysvg .control.drag
    {
      fill: #c00;
      cursor: move;
    }

    #mysvg line
    {
      stroke-width: 1;
      stroke: #999;
      stroke-linecap: round;
      stroke-dasharray: 5,5;
    }

    #output {
      padding: 0.2em;
      background-color: var(--third-bkg-color);
      color: var(--text-color);
      text-align: center;
    }

    h1 {
      font-size: 1.2em;
    }

    #path {
      font-family: monospace;
      font-size: 1em;
      padding: 0.3em;
      border: 1px solid #999;
      user-select: all;
    }

    h3 {
      text-align: center;
    }

    h3 a {
      color: var(--text-color);
    }
  `;

  static properties = {
  };

  constructor() {
    super();
    this.addEventListener('click', () => {this.animate()});
  }

  render() {
    return html`
      <h3>Code used from: <a href="https://www.sitepoint.com/html5-svg-quadratic-curves/">sitepoint - Draw Quadratic Bézier Curves</a></h3>

      <div id="output">
        <h1>SVG Quadratic B&eacute;zier Curve</h1>
        <p id="path"></p>
      </div>
    
      <svg xmlns="http://www.w3.org/2000/svg" id="mysvg" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
    
        <title>SVG curve</title>
        <desc>example curves in SVG</desc>
    
        <circle id="p1" cx="100" cy="250" r="15" class="control" />
        <circle id="p2" cx="400" cy="250" r="15" class="control" />
    
        <circle id="c1" cx="250" cy="100" r="10" class="control" />
    
        <line id="l1" x1="100" y1="250" x2="250" y2="100" />
        <line id="l2" x1="400" y1="250" x2="250" y2="100" />
    
        <path id="curve" d="M100,250 Q250,100 400,250" />
    
      </svg>
    `;
  }

  dragHandler(event) {
    let drag;

    event.preventDefault();

    const
      target = event.target,
      type = event.type,
      svgP = this.svgPoint(svg, event.clientX, event.clientY);

    // fill toggle
    if (!drag && type === 'pointerdown' && target === node.curve) {

      node.curve.classList.toggle('fill');
      this.drawCurve();

    }

    // start drag
    if (!drag && type === 'pointerdown' && target.classList.contains('control')) {

      drag = {
        node: target,
        start: getControlPoint(target),
        cursor: svgP
      };

      drag.node.classList.add('drag');

    }

    // move element
    if (drag && type === 'pointermove') {

      this.updateElement(
        drag.node,
        {
          cx: Math.max(box.xMin, Math.min( drag.start.x + svgP.x - drag.cursor.x, box.xMax )),
          cy: Math.max(box.yMin, Math.min( drag.start.y + svgP.y - drag.cursor.y, box.yMax ))
        }
      );

      this.drawCurve();

    }

    // stop drag
    if (drag && type === 'pointerup') {

      drag.node.classList.remove('drag');
      drag = null;

    }

  }

  // translate page to SVG co-ordinate
  svgPoint(element, x, y) {

    var pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(element.getScreenCTM().inverse());

  }

  updateElement(element, attr) {

    for (a in attr) {
      let v = attr[a];
      element.setAttribute(a, isNaN(v) ? v : Math.round(v));
    }

  }

  getControlPoint(circle) {

    return {
      x: Math.round( +circle.getAttribute('cx') ),
      y: Math.round( +circle.getAttribute('cy') )
    }

  }


  drawCurve() {
    const
      p1 = this.getControlPoint(node.p1),
      p2 = this.getControlPoint(node.p2),
      c1 = this.getControlPoint(node.c1);

    // control line 1
    this.updateElement(
      node.l1,
      {
        x1: p1.x,
        y1: p1.y,
        x2: c1.x,
        y2: c1.y
      }
    );

    // control line 2
    this.updateElement(
      node.l2,
      {
        x1: p2.x,
        y1: p2.y,
        x2: c1.x,
        y2: c1.y
      }
    );

    // curve
    const
      d = `M${p1.x},${p1.y} Q${c1.x},${c1.y} ${p2.x},${p2.y}` +
      (node.curve.classList.contains('fill') ? ' Z' : '');

    this.updateElement( node.curve, { d } );

    node.path.textContent = `<path d="${d}" />`;

  }
  
  animate(){

    var
      svg = this.renderRoot?.getElementById('mysvg'),
      NS = svg.getAttribute('xmlns'),
      vb = svg.getAttribute('viewBox').split(' ').map(v => +v),
      box = {
        xMin: vb[0], xMax: vb[0] + vb[2] - 1,
        yMin: vb[1], yMax: vb[1] + vb[3] - 1
      },
      node = {};

    'p1,p2,c1,l1,l2,curve,path'.split(',').map(s => {
      node[s] = this.renderRoot?.getElementById(s);
    });

    // events
    svg.addEventListener('pointerdown', this.dragHandler);
    document.addEventListener('pointermove', this.dragHandler);
    document.addEventListener('pointerup', this.dragHandler);

    this.drawCurve();

  }

}

customElements.define('my-bezieranimation', BezierAnimation);