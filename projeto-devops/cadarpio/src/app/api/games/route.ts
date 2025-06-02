import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mpkeehelfdxqejkisvmz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2VlaGVsZmR4cWVqa2lzdm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MTE2NTMsImV4cCI6MjA2NDM4NzY1M30.8X0Y1JejP228mPDL0joqMbLY6VlgfDI7IPSgpVOwQRs';
const supabase = createClient(supabaseUrl, supabaseKey);


export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return NextResponse.json({ message: 'Erro ao carregar os jogos.' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const newGame = await request.json();
    
    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar jogo:", error);
    return NextResponse.json({ message: 'Erro ao adicionar o jogo.' }, { status: 500 });
  }
}