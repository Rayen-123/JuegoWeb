// /app/page.js
// IMPORTANTE: Este componente es ASÍNCRONO y se ejecuta en el servidor.
import React from 'react';

// ==========================================================
// 1. FUNCIÓN DE OBTENCIÓN DE DATOS (Server-Side Fetch)
// ==========================================================
async function getDriveAssets() {
    // 🚨 REEMPLAZA ESTO con la URL de tu Google Apps Script desplegada
    const apiUrl = 'https://script.google.com/macros/s/AKfycbyJi-jzyUrbw1n0mpUozsq_L8iV7JjZhYoZEvjBhxB1l2uMCdYSEwbnhWcUOMfcbdkz/exec'; 

    try {
        const res = await fetch(apiUrl, { 
            next: { revalidate: 3600 } 
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status} al obtener datos de Drive.`);
        }
        
        // 🚨 CORRECCIÓN CRÍTICA 1: Usar 'await' para obtener el JSON
        const jsonResponse = await res.json();
        
        // El Apps Script devuelve { data: [...] }
        const imagesData = jsonResponse.data || []; 

        // 🚨 CORRECCIÓN CRÍTICA 2: Crear la URL del CDN usando solo el ID
        const proxiedData = imagesData.map(item => {
            
            // Usamos solo el ID del archivo, que es lo que el CDN necesita
            const cdnUrl = `https://cdn.statically.io/img/drive.google.com/uc?id=${item.id}`;
            
            return {
                ...item,
                url: cdnUrl // La URL final y funcional
            };
        });

        return proxiedData; // Devolvemos la lista con las URLs corregidas
        
    } catch (error) {
        console.error("Fallo al cargar assets de Drive:", error);
        return null;
    }
}

// ==========================================================
// 2. COMPONENTE PRINCIPAL (Renderizado en el Servidor)
// ==========================================================
export default async function ImageGalleryPage() {
    
    const imagesData = await getDriveAssets();

    if (!imagesData || imagesData.length === 0) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Error de Carga</h1>
                <p>No se pudieron obtener imágenes de Google Drive o la carpeta está vacía.</p>
                <p>Verifique los permisos de la carpeta y la URL del Apps Script.</p>
            </div>
        );
    }

    // Estilos básicos para la galería
    const galleryStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
        justifyContent: 'center'
    };

    const imageContainerStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center'
    };
    
    // Mapear los datos de las imágenes a elementos <img> de HTML
    const imageElements = imagesData.map((item, index) => (
        <div key={item.id || index} style={imageContainerStyle}>
            {/* Usamos la URL de descarga directa generada por el Apps Script 
              en la etiqueta <img>. El navegador la renderiza directamente.
            */}
            <img 
                src={item.url} 
                alt={item.name} 
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <p style={{ margin: '5px 0 0', fontSize: '12px' }}>{item.name}</p>
        </div>
    ));

    return (
        <div>
            <h1 style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                Galería de Imágenes (Cargadas desde Google Drive)
            </h1>
            
            <div style={galleryStyle}>
                {imageElements}
            </div>
        </div>
    );
}

// Asegúrate de que tu /app/layout.js tenga la importación de global.css
// para tener un reset de estilos limpio.