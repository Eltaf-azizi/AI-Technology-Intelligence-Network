"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { technologies, relationships, getTechnologyById } from "@/lib/knowledge-graph";
import { Technology } from "@/lib/types";

interface KnowledgeGraphProps {
  onSelectTechnology?: (tech: Technology) => void;
  selectedId?: string;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  color: string;
  popularity: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: string;
  strength: number;
}

export function KnowledgeGraph({ onSelectTechnology, selectedId }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const drawGraph = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    const nodes: SimNode[] = technologies.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      color: t.color,
      popularity: t.popularity,
    }));

    const links: SimLink[] = relationships.map(r => ({
      source: r.source,
      target: r.target,
      type: r.type,
      strength: r.strength / 100,
    }));

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force("link", d3.forceLink<SimNode, SimLink>(links).id(d => d.id).distance(d => 180 - (d as SimLink).strength * 80))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => 30 + (d as SimNode).popularity / 10));

    const defs = svg.append("defs");
    links.forEach((link, i) => {
      defs.append("marker")
        .attr("id", `arrow-${i}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "rgba(100, 116, 139, 0.4)");
    });

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(100, 116, 139, 0.2)")
      .attr("stroke-width", d => Math.max(1, d.strength * 3))
      .attr("stroke-dasharray", d => d.strength > 0.85 ? "" : "4,4")
      .attr("marker-end", (_, i) => `url(#arrow-${i})`);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    node.append("circle")
      .attr("r", d => 12 + (d.popularity / 10))
      .attr("fill", d => d.color)
      .attr("opacity", 0.9)
      .attr("stroke", d => d.color)
      .attr("stroke-width", d => hoveredNode === d.id ? 3 : 0)
      .attr("stroke-opacity", 0.5)
      .style("filter", "drop-shadow(0 0 6px rgba(0,212,255,0.2))");

    node.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", d => 28 + (d.popularity / 10))
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .attr("font-family", "Inter, sans-serif")
      .attr("font-weight", d => hoveredNode === d.id ? "600" : "400")
      .style("pointer-events", "none");

    node.on("click", (_event, d) => {
      const tech = getTechnologyById(d.id);
      if (tech && onSelectTechnology) onSelectTechnology(tech);
    });

    node.on("mouseenter", function (_event, d) {
      setHoveredNode(d.id);
      const relatedIds = new Set(
        relationships
          .filter(r => r.source === d.id || r.target === d.id)
          .flatMap(r => [r.source, r.target])
      );
      link
        .attr("stroke", l => {
          const ls = l.source as SimNode;
          const lt = l.target as SimNode;
          return (ls.id === d.id || lt.id === d.id) ? "rgba(0, 212, 255, 0.5)" : "rgba(100, 116, 139, 0.05)";
        })
        .attr("stroke-width", l => {
          const ls = l.source as SimNode;
          const lt = l.target as SimNode;
          return (ls.id === d.id || lt.id === d.id) ? Math.max(2, (l as SimLink).strength * 4) : 0.5;
        });
      node.selectAll("circle").attr("opacity", n =>
        (n as SimNode).id === d.id || relatedIds.has((n as SimNode).id) ? 1 : 0.2
      );
      node.selectAll("text").attr("opacity", n =>
        (n as SimNode).id === d.id || relatedIds.has((n as SimNode).id) ? 1 : 0.2
      );
    });

    node.on("mouseleave", () => {
      setHoveredNode(null);
      link.attr("stroke", "rgba(100, 116, 139, 0.2)").attr("stroke-width", d => Math.max(1, (d as SimLink).strength * 3));
      node.selectAll("circle").attr("opacity", 0.9);
      node.selectAll("text").attr("opacity", 1);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as SimNode).x!)
        .attr("y1", d => (d.source as SimNode).y!)
        .attr("x2", d => (d.target as SimNode).x!)
        .attr("y2", d => (d.target as SimNode).y!);
      node.attr("transform", d => `translate(${d.x!},${d.y!})`);
    });
  }, [dimensions, hoveredNode, onSelectTechnology]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
}
