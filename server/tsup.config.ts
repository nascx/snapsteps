import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],  // Inclui todos os arquivos .ts dentro de src e subdiretórios
  outDir: 'dist',          // Diretório de saída
  splitting: true,         // Habilita a divisão de arquivos
  sourcemap: true,         // Gera mapas de origem (opcional)
  clean: true,             // Limpa o diretório de saída antes de compilar
  dts: true,               // Gera arquivos de declaração de tipo (.d.ts)
  format: ['esm'],  // Formatos de saída, como CommonJS e ESM
  tsconfig: 'tsconfig.json', // Especifica o caminho para o tsconfig.json
});