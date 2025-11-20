export const calculateScore = ({
  Basic_verification,
  Background_check,
  Experience,
  Positive_behavior
}) => {
  const breakdown = {
    Basic_verification: Basic_verification * 100,
    Background_check: Background_check * 150,
    Experience: Experience * 200,
    Positive_behavior: Positive_behavior * 300
  };

  const finalScore =
    breakdown.Basic_verification +
    breakdown.Background_check +
    breakdown.Experience +
    breakdown.Positive_behavior;

  return { breakdown, finalScore };
};
