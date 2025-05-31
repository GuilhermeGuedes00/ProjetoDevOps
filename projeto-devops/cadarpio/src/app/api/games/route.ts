// app/api/games/route.js
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'data', 'games.json');

// Handler para requisições GET
export async function GET(request) {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const games = JSON.parse(jsonData);
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("Erro ao ler games.json:", error);
    // Se o arquivo não existir ou for inválido, retorne um array vazio ou um erro adequado
    if (error.code === 'ENOENT') { // ENOENT significa "Error No ENTity" (arquivo não encontrado)
      console.warn("games.json não encontrado. Retornando array vazio.");
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json({ message: 'Erro ao carregar os jogos.' }, { status: 500 });
  }
}

// Handler para requisições POST
export async function POST(request) {
  try {
    const newGame = await request.json();

    // Adicione um ID único ao novo jogo (exemplo simples com timestamp)
    const gameWithId = { id: Date.now(), ...newGame };

    let games = [];
    try {
      const jsonData = await fs.readFile(filePath, 'utf-8');
      games = JSON.parse(jsonData);
    } catch (readError) {
      // Se o arquivo não existir ou for inválido, comece com um array vazio
      if (readError.code === 'ENOENT') {
        console.warn("games.json não encontrado ao tentar ler para POST. Criando um novo array.");
        games = [];
      } else {
        throw readError; // Re-lança outros erros de leitura
      }
    }

    games.push(gameWithId); // Adiciona o novo jogo

    await fs.writeFile(filePath, JSON.stringify(games, null, 2)); // Salva o array atualizado
    return NextResponse.json(gameWithId, { status: 201 }); // Retorna o jogo adicionado com ID
  } catch (error) {
    console.error("Erro ao escrever em games.json:", error);
    return NextResponse.json({ message: 'Erro ao adicionar o jogo.' }, { status: 500 });
  }
}