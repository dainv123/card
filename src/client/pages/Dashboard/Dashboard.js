import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Table, Tag, Button } from 'antd';
import SelectThemeModal from '../../components/SelectThemeModal/SelectThemeModal';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import { mutations, queries } from '../../graphql/graphql';

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
  // const [CreateTheme] = useMutation(mutations.CREATE_THEME);
  const response = useQuery(queries.GET_THEMES);
  const data = (response && response.data && response.data.themes) || [];
  // useQuery(queries.GET_THEME, {
  //   variables: { id: "659fa786e775bb42704f2b27" },
  // });
  
  useEffect(() => {
    // CreateTheme({ variables: { name: "name", path: "#" } }).then(
    //   res => {
    //     console.log(123);
    //   },
    //   err => {
    //     console.log(11);
    //   })
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
      <Button type="primary" onClick={showModal}>Add</Button>
      <SelectThemeModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}></SelectThemeModal>
      <Table columns={columns} dataSource={data} rowKey={'id'}></Table>
    </LoggedLayout>
  )
}

export default DashboardPage;
