from __future__ import annotations

from src.domain.enums import DataStatus
from src.domain.models import ChartVisualization


def validate_visualization(visualization: ChartVisualization) -> tuple[bool, list[str]]:
    errors: list[str] = []
    statuses: set[DataStatus] = {visualization.data_status}
    for series in visualization.series:
        statuses.add(series.data_status)
        for point in series.points:
            statuses.add(point.data_status)
            if point.data_status != series.data_status:
                errors.append(
                    f"Series '{series.key}' mixes data status {point.data_status} with {series.data_status}."
                )

    non_unavailable = {status for status in statuses if status != DataStatus.UNAVAILABLE}
    if len(non_unavailable) > 1:
        errors.append("Real, issuer-reported, and synthetic observations cannot be combined in one chart.")

    if visualization.template_id == "PRICE_VOLUME_V1" and len(visualization.series) < 2:
        errors.append("PRICE_VOLUME_V1 requires close price and volume series.")

    if visualization.template_id == "FINANCIAL_TREND_V1":
        for series in visualization.series:
            if len(series.points) < 2:
                errors.append(f"Financial trend series '{series.key}' requires at least two periods.")

    return not errors, errors
