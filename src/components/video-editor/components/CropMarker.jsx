import React from 'react';
import interact from 'interact.js';
import PropTypes from 'prop-types';

class CropMarker extends React.Component {
  componentDidMount() {
    const dragMoveListener = (event) => {
      const target = event.target;
      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      if (this.props.isStart) {
        if (x < 0) x = 0;
        if (x > this.props.parentWidth) x = this.props.parentWidth;
      } else {
        if (x < 15) x = 15;
        if (x > this.props.parentWidth + 15) x = this.props.parentWidth + 15;
      }

      target.style.transform = 'translate(' + x + 'px, 0px)';

      target.setAttribute('data-x', x);
    };

    if (this.props.isStart) {
      interact('.draggable_start').draggable({
        inertia: true,
        restrict: {
          restriction: 'parent',
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        },
        autoScroll: true,
        onmove: (event) => {
          dragMoveListener(event);
          var target = event.target;
          this.props.cropsChanged(
            'start',
            (parseFloat(target.getAttribute('data-x')) /
              this.props.parentWidth) *
              100
          );
        },
        onend: (event) => {
          var target = event.target;
          this.props.cropsChanged(
            'start',
            (parseFloat(target.getAttribute('data-x')) /
              this.props.parentWidth) *
              100
          );
        },
      });
    } else {
      interact('.draggable_end').draggable({
        inertia: true,
        restrict: {
          restriction: 'parent',
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        },
        autoScroll: true,
        onmove: (event) => {
          dragMoveListener(event);
          var target = event.target;
          this.props.cropsChanged(
            'end',
            ((parseFloat(target.getAttribute('data-x')) - 15) /
              this.props.parentWidth) *
              100
          );
        },
        onend: (event) => {
          var target = event.target;
          this.props.cropsChanged(
            'end',
            ((parseFloat(target.getAttribute('data-x')) - 15) /
              this.props.parentWidth) *
              100
          );
        },
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.position !== nextProps.position ||
      this.props.parentWidth !== nextProps.parentWidth
    );
  }

  render() {
    let className = 'end_marker draggable_end';
    let content = (
      <svg
        width="7"
        height="18"
        viewBox="0 0 7 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.82629 0.338549C0.952956 0.33802 1.07991 0.40749 1.18054 0.557071L5.5544 7.05886C6.26549 8.1159 6.27276 9.85588 5.57052 10.9188L1.25113 17.4569C1.05901 17.7477 0.739011 17.7491 0.544469 17.4599C0.349926 17.1707 0.347921 16.6907 0.540041 16.3999L4.85944 9.86179C5.17743 9.38045 5.17417 8.60046 4.85217 8.1218L0.478307 1.62001C0.283764 1.33082 0.281759 0.850828 0.473879 0.560022C0.573293 0.419607 0.699625 0.339078 0.82629 0.338549Z"
          fill="white"
        />
      </svg>
    );
    if (this.props.isStart) {
      className = 'start_marker draggable_start';
      content = (
        <svg
          width="7"
          height="18"
          viewBox="0 0 7 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.00002 17.67C5.87335 17.67 5.74669 17.6 5.64669 17.45L1.30002 10.93C0.593353 9.87002 0.593353 8.13002 1.30002 7.07002L5.64669 0.55002C5.84002 0.26002 6.16002 0.26002 6.35335 0.55002C6.54669 0.84002 6.54669 1.32002 6.35335 1.61002L2.00669 8.13002C1.68669 8.61002 1.68669 9.39002 2.00669 9.87002L6.35335 16.39C6.54669 16.68 6.54669 17.16 6.35335 17.45C6.25335 17.59 6.12669 17.67 6.00002 17.67Z"
            fill="white"
          />
        </svg>
      );
    }

    return (
      <div
        className={className}
        style={{
          transform: 'translate(' + this.props.position + 'px, 0px)',
        }}
        data-x={this.props.position}
      >
        {content}
      </div>
    );
  }
}

CropMarker.propTypes = {
  position: PropTypes.number,
  isStart: PropTypes.bool,
  cropsChanged: PropTypes.func,
};

export default CropMarker;
