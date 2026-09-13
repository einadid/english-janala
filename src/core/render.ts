/**
 * Render bus: lets any view ask the shell to re-render the current route
 * without importing the shell (which would be a circular import).
 */

type Renderer = () => void;

let renderer: Renderer | null = null;

export function setRenderer(fn: Renderer): void {
  renderer = fn;
}

export function refresh(): void {
  renderer?.();
}
