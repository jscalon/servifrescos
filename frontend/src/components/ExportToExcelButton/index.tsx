import { useState } from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import styles from "./ExportToExcelButton.module.css";

interface ExportToExcelButtonProps {
  data: Record<string, any>[];
  headers: string[];
  keys: string[];
  fileName: string;
}

export default function ExportToExcelButton({
  data,
  headers,
  keys,
  fileName,
}: ExportToExcelButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Datos");

      // Agregar encabezados
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "087033" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          wrapText: true,
          horizontal: "center",
          vertical: "middle",
        };
      });

      // Agregar datos
      data.forEach((item) => {
        const row = keys.map((key) => item[key] || "");
        const dataRow = worksheet.addRow(row);
        dataRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            wrapText: true,
            horizontal: "center",
            vertical: "middle",
          };
        });
      });

      // Ajustar alto de filas para wrap text
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          // Saltar header
          let maxLines = 1;
          row.eachCell((cell) => {
            if (cell.value) {
              const text = cell.value.toString();
              const colWidth = worksheet.getColumn(cell.col).width || 10;
              const lines = Math.ceil(text.length / (colWidth * 3)); // Factor ajustado para wrap
              if (lines > maxLines) maxLines = lines;
            }
          });
          if (maxLines > 1) {
            row.height = maxLines * 15; // 15 puntos por línea
          }
        }
      });

      // Autoajustar columnas
      headers.forEach((_, colIndex) => {
        const minWidth = 10;
        const maxWidth = 40; // Ancho máximo para forzar wrap en textos largos
        let columnWidth = minWidth;
        worksheet.eachRow((row) => {
          const cell = row.getCell(colIndex + 1);
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > columnWidth) {
            columnWidth = cellLength;
          }
        });
        columnWidth = Math.min(columnWidth + 5, maxWidth); // Buffer de 5, pero no superar maxWidth
        worksheet.getColumn(colIndex + 1).width = columnWidth;
      });

      // Generar buffer y descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("Error al exportar el archivo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={styles.exportButton}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? "Exportando..." : "Exportar a Excel"}
      <span className={styles.icon}>📊</span>
    </button>
  );
}
