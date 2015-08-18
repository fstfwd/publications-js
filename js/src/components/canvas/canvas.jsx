import React, {Component} from 'react';

import CanvasBackground from './canvas.background';
import ShapeEllipse from './shape.ellipse';
import ShapeRect from './shape.rect';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let {
        doc,
        dpi,
        selectable,
        selectedShape,
        showInspector,
        updateSelectedCanvasObject,
        updateShape,
        zoom
      } = this.props;

    return (
      <div className={`canvas-container ${showInspector ? 'canvas-container-expanded' : ''}`}>
        <svg width={doc.width * dpi * zoom}
          height={doc.height * dpi * zoom}
          className="canvas-svg"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1">
          <g>
            <CanvasBackground
              doc={doc}
              dpi={dpi}
              selectable={selectable}
              updateSelectedCanvasObject={updateSelectedCanvasObject}
              zoom={zoom} />
          </g>
          <g>
            {
              doc.shapes.map((shape, idx) => {
                switch (shape.type) {
                  case 'rect':
                  return (<ShapeRect
                            dpi={dpi}
                            key={idx}
                            selectable={selectable}
                            selectedShape={selectedShape}
                            shape={shape}
                            updateShape={updateShape}
                            updateSelectedCanvasObject={updateSelectedCanvasObject}
                            zoom={zoom} />);

                  case 'ellipse':
                  return (<ShapeEllipse dpi={dpi}
                            key={idx}
                            selectable={selectable}
                            selectedShape={selectedShape}
                            shape={shape}
                            updateShape={updateShape}
                            updateSelectedCanvasObject={updateSelectedCanvasObject}
                            zoom={zoom} />);

                  default:
                  return <g key={idx} />;
                }
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}