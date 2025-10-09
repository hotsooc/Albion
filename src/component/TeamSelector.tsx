'use client';

import { useState } from 'react';
import { Modal, Input } from 'antd';

type TeamSelectorProps = {
  teamNames: string[];
  teamKeys: string[];
  openTeamIndex: number;
  handlePrevTeam: () => void;
  handleNextTeam: () => void;
  handleToggleTeam: (index: number) => void;
  handleAddTeam: (name: string) => void;
  handleDeleteTeam: (index: number) => void;
  handleEditTeam: (index: number, newName: string) => void;
};

export const TeamSelector = ({
  teamNames,
  teamKeys,
  openTeamIndex,
  handlePrevTeam,
  handleNextTeam,
  handleToggleTeam,
  handleAddTeam,
  handleDeleteTeam,
  handleEditTeam,
}: TeamSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const showAddModal = () => {
    setNewTeamName('');
    setEditIndex(null);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (newTeamName.trim() === '') {
      alert('Tên team không được để trống.');
      return;
    }
    if (editIndex !== null) {
      handleEditTeam(editIndex, newTeamName);
    } else {
      handleAddTeam(newTeamName);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showEditModal = (index: number) => {
    setNewTeamName(teamNames[index]);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  return (
    <div className='flex flex-row gap-4 w-full justify-center overflow-auto items-center p-2'>
      <button className='bg-transparent border-none p-0 cursor-pointer' onClick={handlePrevTeam}>
        <img src='/image/left-icon.png' alt='Previous team' width={20} height={20} />
      </button>

      {Array.isArray(teamNames) && teamNames.map((name, index) => (
        <div
          key={teamKeys[index]}
          className={`flex-1 text-center text-xl font-bold cursor-pointer transition-colors border-[1px] border-solid border-gray-200 rounded-full px-8 py-2 relative group ${openTeamIndex === index ? 'bg-sky-500 text-white' : 'bg-white text-gray-700 hover:bg-sky-200'}`}
        >
          <div className="flex items-center justify-center gap-2 ml-10" onClick={() => handleToggleTeam(index)}>
            <span>{name}</span>
            <button
              className="p-1 rounded-full text-blue-800 bg-opacity-80 hover:bg-opacity-100 transition-opacity opacity-0 group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); showEditModal(index); }}
              title="Sửa tên team"
            >
              <img src='/image/edit_icon.png' alt='Edit' width={16} height={16} />
            </button>
          </div>
          
          {(index >= 3 || (index < 3 && teamKeys.length > 3)) && (
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); handleDeleteTeam(index); }}
              title="Xóa team"
            >
              &times;
            </button>
          )}
        </div>
      ))}

      <div
        className={'text-center text-xl font-bold cursor-pointer transition-colors border-[1px] border-solid border-gray-200 rounded-full px-8 py-2 bg-white text-gray-700 hover:bg-sky-200'}
        onClick={showAddModal}
      >
        <img src='/image/add_icon.png' alt='Add new team' width={28} height={28} />
      </div>

      <button className='bg-transparent border-none p-0 cursor-pointer' onClick={handleNextTeam}>
        <img src='/image/right_icon.png' alt='Next team' width={20} height={20} />
      </button>

      <Modal
        title={editIndex !== null ? 'Sửa tên Team' : 'Thêm Team mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        destroyOnClose
      >
        <Input
          placeholder="Nhập tên team"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
      </Modal>
    </div>
  );
};