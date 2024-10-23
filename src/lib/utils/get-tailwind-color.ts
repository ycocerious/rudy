import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export // Utility function to get color value from Tailwind class
function getColorFromTailwindClass(
  className: "primary" | "success" | "destructive",
): string {
  // Resolve the Tailwind config
  const fullConfig = resolveConfig(tailwindConfig);

  // eslint-disable-next-line @typescript-eslint/dot-notation
  return fullConfig.theme.colors[className]["DEFAULT"];
}
