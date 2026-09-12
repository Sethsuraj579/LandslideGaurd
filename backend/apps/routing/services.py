"""Shortest and risk-aware route calculations using NetworkX."""

import networkx as nx

from apps.routing.models import RoadSegment


def build_graph() -> nx.Graph:
    graph = nx.Graph()
    for segment in RoadSegment.objects.all():
        graph.add_edge(
            segment.from_node,
            segment.to_node,
            length=segment.length_m,
            weight=segment.length_m * (1 + segment.risk_penalty),
            risk_penalty=segment.risk_penalty,
            segment_id=segment.id,
        )
    return graph


def calculate_route(start: str, end: str, risk_aware: bool = True) -> dict[str, object]:
    graph = build_graph()
    if start not in graph or end not in graph:
        raise ValueError("Start or end node is not present in the road network")
    weight = "weight" if risk_aware else "length"
    nodes = nx.shortest_path(graph, start, end, weight=weight)
    edges = [graph[nodes[index]][nodes[index + 1]] for index in range(len(nodes) - 1)]
    return {
        "nodes": nodes,
        "distance_m": round(sum(edge["length"] for edge in edges), 2),
        "risk_penalty": round(sum(edge["risk_penalty"] for edge in edges), 2),
        "risk_aware": risk_aware,
        "segment_ids": [edge["segment_id"] for edge in edges],
    }
import networkx as nx

def safest_path(edges: list[dict[str, float | str]], origin: str, destination: str, alpha: float = 2.0, cutoff: float = 70) -> dict[str, object]:
    graph = nx.Graph()
    for edge in edges:
        risk = float(edge.get("risk", 0))
        if risk < cutoff:
            graph.add_edge(str(edge["from"]), str(edge["to"]), weight=float(edge["length_m"]) * (1 + alpha * risk / 100), risk=risk)
    try:
        nodes = nx.shortest_path(graph, origin, destination, weight="weight")
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return {"available": False, "nodes": [], "peak_risk": None}
    risks = [graph[a][b]["risk"] for a, b in zip(nodes, nodes[1:])]
    return {"available": True, "nodes": nodes, "peak_risk": max(risks, default=0), "cost": nx.shortest_path_length(graph, origin, destination, weight="weight")}
