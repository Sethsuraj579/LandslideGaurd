import pytest
from apps.risk.services import fuse_risk, risk_velocity

def test_fusion_uses_specified_weighted_terms() -> None:
    result=fuse_risk(40,60,50,30)
    assert result.score == 47.5
    assert result.level == "WATCH"

def test_velocity_is_per_hour() -> None:
    assert risk_velocity(64,34,3) == 10

def test_invalid_weights_are_rejected() -> None:
    with pytest.raises(ValueError): fuse_risk(1,2,3,4,{"static":1,"rainfall":1,"moisture":1,"antecedent":1})
