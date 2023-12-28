"use client";
import AppContainer from "@/components/Contaner/container";
import Header from "@/components/Header/header";
import { Space } from "@/components/space/Space";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import { IoIosRefresh } from "react-icons/io";
import { Image } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import * as LR from "@uploadcare/blocks";
import { uploadFile } from '@uploadcare/upload-client'

LR.registerBlocks(LR);
const Page = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({}); // Define state for edit form data
  const [newData, setNewData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Define state for selected image
  const [open, setOpen] = useState(false);
  const showModal = (id) => {
    setSelectedProductId(id);
    const selectedProduct = list.find((product) => product.id === id);
    setEditFormData(selectedProduct);
    setSelectedImage(selectedProduct.image);
  };

  const handleCancel = () => {
    setSelectedProductId(null);
    setOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }

    setEditFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }
    setNewData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };
  const handleDeleteClick = (id) => {
    try {
      let url = `http://localhost:3000/api/products/${id}`;
      fetch(url, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://localhost:3000/api/products?query=${search}`;
        let res = await fetch(url);
        let jsonData = await res.json();
        setList(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log(refresh);
    fetchData();
  }, [refresh, search]);
  const handleEditClick = () => {
    try {
      let url = `http://localhost:3000/api/products/${selectedProductId}`;
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
    setRefresh(refresh + 1);
  };
  const handleAddClick = () => {
    try {
      let url = `http://localhost:3000/api/products`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setOpen(false);
    setRefresh(refresh + 1);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
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
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            okText="Yes"
            cancelText="No"
            okType="danger"
            onConfirm={() => handleDeleteClick(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" danger size="large">
              <MdDelete />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <AppContainer width={1300}>
        <Space width="100%" height="20px" />
        <div className="flex justify-between">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Space width="150px" />
          <Button onClick={() => setOpen(true)} size="large">
            Add +
          </Button>
          <Button
            className="default"
            onClick={() => setRefresh(refresh + 1)}
            size="large"
          >
            <IoIosRefresh />
          </Button>
        </div>
        <Space width="100%" height="20px" />
        <Table dataSource={list} columns={columns} />
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
          <p>price</p>
          <Input
            name="price"
            value={editFormData.price}
            onChange={handleEditInputChange}
          />
          <p>image</p>
          <Input
            name="image"
            value={editFormData.image}
            onChange={handleEditInputChange}
          />
          <p>categoryId</p>
          <Input
            name="categoryId"
            value={editFormData.categoryId}
            onChange={handleEditInputChange}
          />
        </Modal>
        {/* Add Modal */}
        <Modal
          title="Product Details"
          open={open}
          onOk={handleAddClick}
          onCancel={handleCancel}
          okType="default"
        >
          <p>name</p>
          <Input name="name" onChange={handleAddInputChange} />
          <p>price</p>
          <Input name="price" onChange={handleAddInputChange} />
          <p>image</p>
          <Input name="image" onChange={handleAddInputChange} />
          <p>categoryId</p>
          <Input name="categoryId" onChange={handleAddInputChange} />
          <Space height="10px" />
          <Button
            type="link"
            style={{ fontSize: "28px", display: "flex", alignItems: "center" }}
          >
            <FaFileUpload />
            <p>Upload img</p>
            <div>
              <lr-config ctx-name="my-uploader" pubkey="f505f6eef4b92762f144" />
              <lr-file-uploader-regular
                ctx-name="my-uploader"
                css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${LR.PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
              />
            </div>
          </Button>
        </Modal>
      </AppContainer>
    </>
  );
};

export default Page;
