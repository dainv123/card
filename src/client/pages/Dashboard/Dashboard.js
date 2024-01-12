import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Table, Tag, Button } from 'antd';
import { mutations, queries } from '../../graphql/graphql';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import CardModal from '../../components/CardModal/CardModal';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <>
        <a>Edit</a>
        <a>Delete</a>
      </>
    ),
  },
];

const DashboardPage = () => {
  var response = useQuery(queries.GET_THEMES);

  const data = (response && response.data && response.data.themes) || [];

  const getList = () => {}
  // useQuery(queries.GET_THEME, {
  //   variables: { id: "659fa786e775bb42704f2b27" },
  // });

  const [CreateCard] = useMutation(mutations.CREATE_CARD);
  useEffect(() => {
    CreateCard({ variables: { userId: "657aa2fc81a7fb7be0772f55", themeId: "659fa3cbc4077e48e8c38096", config: "{title: 'hello world'}" } }).then(
      res => {
        console.log(123);
      },
      err => {
        console.log(11);
      })
  }, []);
  

  const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

  return (
    <LoggedLayout>
      <Button type="primary" onClick={showModal}>Add/Edit</Button>
      <ThemeModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}></ThemeModal>
      <Table columns={columns} dataSource={data} rowKey={'id'}></Table>
      <Button type="primary" onClick={showModal}>Select Theme</Button>
      <CardModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}></CardModal>
      <Table columns={columns} dataSource={data} rowKey={'id'}></Table>
    </LoggedLayout>
  )
}

export default DashboardPage;
