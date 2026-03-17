export async function comprimirImagen(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(archivo);

    reader.onload = (evento) => {
      const img = new Image();
      img.src = evento.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 500;
        const maxHeight = 500;

        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("No se pudo comprimir la imagen."));
              return;
            }

            const archivoComprimido = new File(
              [blob],
              `avatar-${Date.now()}.jpg`,
              {
                type: "image/jpeg",
              }
            );

            resolve(archivoComprimido);
          },
          "image/jpeg",
          0.7
        );
      };

      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
    };

    reader.onerror = () =>
      reject(new Error("No se pudo procesar el archivo."));
  });
}