import * as d3 from 'd3-drag'
import {select} from 'd3-selection'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import useTransformStore from '../Stores/TransformStore'
import { useZoomContextStore } from '../Stores/ZoomContextStore'

interface DraggableProps {
  children: React.ReactNode
  initPosition?: {x: number, y: number}
  updatePosition: (x: number, y: number) => void
}

export const DragContainer = ({children, initPosition, updatePosition}: DraggableProps) => {
  const flowDraggable = useRef<HTMLDivElement>(null)
  const scale = useTransformStore((state) => state.scale)
  const zoomContextDimensions = useZoomContextStore((state) => state.contextDimensions);
  const zoomContextPosition = useZoomContextStore((state) => state.contextPosition);
  const [position, setPosition] = useState(initPosition != undefined ? initPosition : {x: -zoomContextPosition.offsetX, y: -zoomContextPosition.offsetY});

  useEffect(() => {
    const drag = d3.drag().on('drag', (event) => {
      setPosition({x: position.x + event.x / scale, y: position.y + event.y / scale})
    }).subject(() => {
      const selection = select(flowDraggable.current as Element)
      return {x: selection.attr('x'), y: selection.attr('y')}
    }).filter((e) => dragFilter(e))

    select(flowDraggable.current as Element).call(drag)
  }, [position.x, position.y, scale])

  useEffect(() => {
      updatePosition(position.x, position.y)
  },[position, updatePosition, zoomContextDimensions, zoomContextPosition])

  const dragFilter = (e) => {
    const className = e.target.classList.contains('flow-ui-noDrag')
    return !className
  }
  

  return (
    <div style={{zIndex: '1', left: `${position.x}px`, top: `${position.y}px`, position: 'fixed'}} ref={flowDraggable}>
      {children}
    </div>
    
  )
}

export default DragContainer