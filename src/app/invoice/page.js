"use client";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AppContainer from "@/components/Contaner/container";
import Header from "@/components/Header/header";
import { Space } from "@/components/space/Space";

const Page = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => {
        const cart = items && items.cart ? items.cart : [];
        const cartItems = cart.map((cartItem) => cartItem.product.name).join(", ");
        return <div>{cartItems}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleExportPDF(record)}>Export to PDF</Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:3000/api/invoice`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const jsonData = await res.json();

        if (jsonData.success && Array.isArray(jsonData.invoices)) {
          const invoices = jsonData.invoices;
          const formattedData = invoices.map((item) => ({
            ...item,
            items: typeof item.items === "string" ? JSON.parse(item.items) : item.items,
          }));

          setList(formattedData);
        } else {
          console.error("Invalid data format:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const exportToPDF = (invoice) => {
    const tableRef = document.getElementById("invoiceTable");

    // Extract data for the PDF table
    const dataPDF = list.map((item) => ({
      id: item.id,
      date: item.date,
      number: item.number,
      items: item.items && item.items.cart ? item.items.cart.map(cartItem => cartItem.product.name).join(", ") : "",
    }));

    // Create the PDF document
    const pdf = new jsPDF();
    pdf.autoTable({
      head: [['ID', 'Date', 'Number', 'Items']],
      body: dataPDF.map(row => [row.id, row.date, row.number, row.items]),
    });

    // Save PDF file
    pdf.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div>
      <Header />
      <AppContainer width={1300}>
        <Space height={20} />
        <Table id="invoiceTable" columns={columns} dataSource={list} loading={loading} />
      </AppContainer>
      {selectedInvoice && (
        <Button onClick={() => exportToPDF(selectedInvoice)}>Export to PDF</Button>
      )}
    </div>
  );
};

export default Page;
