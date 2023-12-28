"use client";
import Header from "@/components/Header/header";
import React, { useState, useEffect } from "react";
import AppContainer from "@/components/Contaner/container";
import { Card, CardBody, CardFooter, Image, Input } from "@nextui-org/react"; // Make sure to import Input from the library
import { Button, Modal, Table } from "antd";
import { Space } from "@/components/space/Space";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const Page = () => {
  // Change 'page' to 'Page' to follow naming conventions
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({}); // Define state for edit form data
  const [selectedImage, setSelectedImage] = useState(null); // Define state for selected image

  const showModal = (id) => {
    setSelectedProductId(id);
    const selectedProduct = list.find((product) => product.id === id);
    setEditFormData(selectedProduct);
    setSelectedImage(selectedProduct.image);
  };

  const handleCancel = () => {
    setSelectedProductId(null);
  };

  const handleEditInputChange = (e) => {
    // Update the edit form data on input change
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://localhost:3000/api/categories?query=${search}`;
        let res = await fetch(url);
        let jsonData = await res.json();
        setList(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [search]);
  const handleEditClick = () => {
    try {
      let url = `http://localhost:3000/api/categories/${selectedProductId}`;
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setSelectedProductId(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          src={text}
          alt={text}
          style={{ borderRadius: "50%", height: "70px", width: "70px" }}
          width={70}
          height={70}
        />
      ),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space width={20} />
          <Button onClick={() => showModal(record.id)} size="large">
            <FaEdit />
          </Button>
          <Button type="primary" danger size="large">
            <MdDelete />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Space height={20} />
      <AppContainer width={1300}>
        <Table columns={columns} dataSource={list} />
        <Modal
          title="Product Details"
          open={selectedProductId}
          onOk={handleEditClick}
          onCancel={handleCancel}
        >
          {selectedImage && (
            <Image src={selectedImage} alt={"Image"} width={350} height={350} />
          )}
          <p>name</p>
          <Input
            name="name"
            value={editFormData.name}
            onChange={handleEditInputChange}
          />
          <p>image</p>
          <Input
            name="image"
            value={editFormData.image}
            onChange={handleEditInputChange}
          />
          <Space height={10} />
          <Button type="link" style={{ fontSize: "20px" }}>
            <FaFileUpload />
          </Button>
        </Modal>
      </AppContainer>
    </>
  );
};

export default Page;
