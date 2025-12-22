"use client";
import { useState } from "react";
import { Button, Input, SimpleGrid, Image, Box, Spinner, Stack, HStack, IconButton } from "@chakra-ui/react";
import { CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
export default function Page() {

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const buscarFotos = async () => {
    if (!query) return;
    setBuscando(true);
    try {
      const res = await fetch(`/api/pixabay?q=${query}`);
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error("Error en búsqueda");
    } finally {
      setBuscando(false);
    }
  };

  const agregarImagen = (url) => {
    setSeleccionadas([...seleccionadas, url]);
    setResultados([]); 
    setQuery("");      
  };

  // Función para eliminar la imagen por su índice
  const eliminarImagen = (indexAEliminar) => {
    setSeleccionadas(seleccionadas.filter((_, index) => index !== indexAEliminar));
  };
  
	return (
		<>
			<div className="barra-superior">
        <Drawer.Root placement="start">
          <Drawer.Trigger asChild>
            <Button variant="plain" size="md" className="drawer">
              ≡
            </Button>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Body>
                  <HStack wrap="wrap" gap="6" className="botones-drawer-principal">
                    <Button colorPalette="cyan" variant="subtle"> +Agregar </Button>
                    <Button colorPalette="cyan" variant="subtle"> Mochila 1 </Button>
                  </HStack>
                </Drawer.Body>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>   
        <p className="titulo-app">preorganizate</p>
        <div style={{ width: '40px' }}></div> 
      </div>
      <div className="contenido-principal">
      <div className="galeria-fotos">
        
        {/* Imágenes seleccionadas */}
        {seleccionadas.map((url, i) => (
          <Box key={i} className="foto-item">
            <Image src={url} alt="Elegida" />
            
            <IconButton
              aria-label="Eliminar"
              onClick={() => eliminarImagen(i)}
              className="btn-eliminar"
            >
              <LuX size={10} /> {/* Icono más pequeño */}
            </IconButton>
          </Box>
        ))}

        {/* Botón de Agregar (Drawer) */}
        <Drawer.Root placement="end" size="md">
          <Drawer.Trigger asChild>
            <Button className="btn-agregar-dash">
              + Agregar
            </Button>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>Buscador Pixabay</Drawer.Header>
                <Drawer.Body>
                  <Stack gap="4">
                    <HStack>
                      <Input 
                        placeholder="Buscar..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && buscarFotos()}
                      />
                      <Button onClick={buscarFotos} colorPalette="cyan">Buscar</Button>
                    </HStack>

                    {buscando ? <Spinner /> : (
                      <SimpleGrid columns={2} gap="2">
                        {resultados.map((url, index) => (
                          <Box 
                            key={index} 
                            cursor="pointer"
                            onClick={() => agregarImagen(url)}
                          >
                            <Image src={url} borderRadius="md" />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </Stack>
                </Drawer.Body>
                <Drawer.CloseTrigger asChild><CloseButton /></Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </div>
    </div>
		</>
	)
}