const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const moment = require('moment');

dotenv.config();

module.exports = class Utils {
  static LIMIT = 1000;
  static async randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  static groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }
  static formatarMoeda(value) {
    if (!isNaN(value)) {
      let f = value.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
      return f;
    }
    return null;
  }

  static enviarEmail(mailOptions) {
    const options = {
      service: process.env.NODE_MAILER_SERVICE || undefined,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
      },
      host: process.env.NODE_MAILER_HOST || undefined,
      port: process.env.NODE_MAILER_PORT || undefined,
      secure: process.env.NODE_MAILER_SECURE || false,
    };

    
    const transporter = nodemailer.createTransport(options);
    return transporter.sendMail(mailOptions);
  }

  static printPDF({
    title,
    header = [],
    columnHead = [],
    data = [],
    total = 0,
  }) {
    const doc = new jsPDF();
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(title, 5, 15);
    if (header) {
      doc.setFontSize(11);
      header.map((h, index) => {
        doc.text(
          h.label + ": " + h.value,
          index / 3 < 1 ? 15 : 135,
          25 + 5 * (index / 3 < 1 ? index : index - 3)
        );
      });
    }

    // Dados
    doc.autoTable({
      showHead: "everyPage",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 5 : 45,
      head: [columnHead.map((h) => h.label)],
      body: data.map((row) => {
        return columnHead.map((h) =>
          h.key.split(".").reduce((a, v) => {
            if (h.groupKey) {
              return h.groupKey
                .map((g) => (a[g] ? (!h.format ? a[g] : h.format(a[v])) : ""))
                .join(" ");
            } else {
              return !h.format ? a[v] : h.format(a[v]);
            }
          }, row)
        );
      }),
      foot: [["", "", "", `Total: ${total}`]],
      didParseCell: (data) => {
        if (
          (data.cell && data.cell.section === "foot") ||
          data.column.index == 3
        ) {
          data.cell.styles.halign = "right";
        }
      },
      columnStyles: {
        3: { halign: "right" },
      },
      footStyles: {
        fillColor: [217, 217, 214],
        textColor: [0, 0, 0],
        fontSize: 11,
      },
      showFoot: "lastPage",
    });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const pages = doc.internal.getNumberOfPages();
    for (let j = 1; j < pages + 1; j++) {
      let horizontalPos = pageWidth - 10;
      let verticalPos = pageHeight - 5;
      doc.setPage(j);
      doc.setFontSize(8);
      doc.text(moment().format("DD/MM/YY HH:mm"), horizontalPos, 5, {
        align: "right",
      });
      doc.setFontSize(12);
      doc.text(`${j} de ${pages}`, horizontalPos, verticalPos, {
        align: "right",
      });
    }
    return Buffer.from(doc.output('arraybuffer'));
  }
};
