from enum import Enum


class MarketSegment(str, Enum):
    MAIN = "MAIN"
    GROWTH = "GROWTH"


class RequirementState(str, Enum):
    MET = "MET"
    NOT_MET = "NOT_MET"
    MISSING_EVIDENCE = "MISSING_EVIDENCE"
    CONFLICT = "CONFLICT"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    PROFESSIONAL_REVIEW = "PROFESSIONAL_REVIEW"


class RuleOperator(str, Enum):
    GTE = "GTE"
    LTE = "LTE"
    GT = "GT"
    LT = "LT"
    EQ = "EQ"
    RANGE = "RANGE"


class ReviewStatus(str, Enum):
    DRAFT = "DRAFT"
    APPROVED = "APPROVED"


class FactStatus(str, Enum):
    EXTRACTED = "EXTRACTED"
    USER_CONFIRMED = "USER_CONFIRMED"
    CONFLICT = "CONFLICT"


class TrustClass(str, Enum):
    OFFICIAL_REGULATORY = "official_regulatory"
    OFFICIAL_ISSUER_FILING = "official_issuer_filing"
    USER_DRAFT = "user_draft"
    SYNTHETIC_FIXTURE = "synthetic_fixture"


class IndexStatus(str, Enum):
    PENDING = "pending"
    INDEXED = "indexed"
    RETIRED = "retired"


class DataStatus(str, Enum):
    OFFICIAL = "OFFICIAL"
    ISSUER_REPORTED = "ISSUER_REPORTED"
    USER_SUPPLIED = "USER_SUPPLIED"
    SYNTHETIC_DEMO = "SYNTHETIC_DEMO"
    UNAVAILABLE = "UNAVAILABLE"


class CompanyExploreIntent(str, Enum):
    COMPANY_PRICE_HISTORY = "company_price_history"
    COMPANY_FINANCIAL_TREND = "company_financial_trend"
    COMPANY_READINESS = "company_readiness"
