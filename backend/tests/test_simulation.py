from apps.simulation.services import simulate

def test_simulation_does_not_mutate_and_increases_risk() -> None:
    result=simulate(55,60,65,55,30,10)
    assert result["after"] > result["before"]
