"use client";
import Header from "@/components/Header/header";
import React, { useState, useEffect } from "react";
import AppContainer from "@/components/Contaner/container";
import { Image } from "@nextui-org/react"; // Make sure to import Input from the library
import { Button, Modal, Table, Input, Typography, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Space } from "@/components/space/Space";
import { FaEdit } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const { Text } = Typography;

const Page = () => {
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({}); // Define state for edit form data
  const [selectedImage, setSelectedImage] = useState(null); // Define state for selected image
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({});
  const [loading, setLoading] = useState(true);

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
    // Update the edit form data on input change
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddInputChange = (e) => {
    setNewData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleDeleteClick = async (id) => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/categories/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (response.ok) {
        if (
          responseData.error &&
          responseData.error.includes(
            "Cannot delete category with associated products"
          )
        ) {
          // Use Ant Design Modal for a more styled and customizable alert
          Modal.error({
            title:
              "Cannot delete category because there are associated products.",
            okButtonProps: { type: "default" },
          });
        } else {
          console.error("Error deleting category:", responseData.error);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // This part will be executed only if the response is successful
      setRefresh((prevRefresh) => prevRefresh + 1);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        let url = `https://final-task-noaf.vercel.app/api/categories?query=${search}`;
        let res = await fetch(url);
        let jsonData = await res.json();
        setList(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [search, refresh]);
  const handleEditClick = () => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/categories/${selectedProductId}`;
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          setRefresh((prevRefresh) => prevRefresh + 1);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
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
  const handleAddClick = () => {
    try {
      let url = `https://final-task-noaf.vercel.app/api/categories`;
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

  return (
    <>
      <Header />
      <Space height={20} />
      <AppContainer width={1300}>
        <Space width="100%" height="20px" />
        <div className="flex justify-between">
          <Input
            placeholder="Search..."
            //onChange={}
            onPressEnter={(e) => setSearch(e.target.value)}
          />
          <div className="flex">
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
        </div>
        <Space width="100%" height="20px" />
        <Table columns={columns} dataSource={list} loading={loading} />
        <Modal
          title="Product Details"
          open={selectedProductId}
          onOk={handleEditClick}
          onCancel={handleCancel}
        >
          {selectedImage && (
            <Image src={selectedImage} alt={"Image"} width={350} height={350} />
          )}
          <Text>name</Text>
          <Input
            name="name"
            value={editFormData.name}
            onChange={handleEditInputChange}
          />
          <Text>image</Text>
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
        {/* Add Modal */}
        <Modal
          title="Product Details"
          open={open}
          onOk={handleAddClick}
          onCancel={handleCancel}
          okType="default"
        >
          <Text>name</Text>
          <Input name="name" onChange={handleAddInputChange} />
          <Text>image</Text>
          <Input name="image" onChange={handleAddInputChange} />
        </Modal>
      </AppContainer>
    </>
  );
};

export default Page;
