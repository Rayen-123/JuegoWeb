import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const API_KEY = '53854270-004a69b996aa57d67a35dea68'; // Reemplaza con tu clave real

  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Extraemos las URLs de las previsualizaciones
    const imagenes = data.hits.map(hit => hit.webformatURL);
    return NextResponse.json(imagenes);
  } catch (error) {
    return NextResponse.json({ error: "Error al conectar con Pixabay" }, { status: 500 });
  }
}