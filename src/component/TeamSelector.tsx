'use client';

import { useState } from 'react';
import { Modal, Input } from 'antd';
import useTrans from '@/hooks/useTrans';

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
  const { trans } = useTrans();

  const showAddModal = () => {
    setNewTeamName('');
    setEditIndex(null);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (newTeamName.trim() === '') {
      alert(trans.teammate.teamNameEmptyError);
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
    <div className='flex flex-row gap-4 w-full justify-center overflow-auto items-center p-4 text-black'>
      <button 
        className="cursor-pointer bg-white hover:bg-[#fcf8f2] border-2 border-black rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all" 
        onClick={handlePrevTeam}
      >
        <img src='/image/left-icon.png' alt='Previous team' width={14} height={14} />
      </button>

      {Array.isArray(teamNames) && teamNames.map((name, index) => {
        const isActive = openTeamIndex === index;
        return (
          <div
            key={index}
            onClick={() => handleToggleTeam(index)}
            className={`text-center font-bold cursor-pointer transition-all duration-200 border-2 border-black rounded-full px-6 py-2 relative group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] ${
              isActive 
                ? 'bg-[#ebc7b5] text-black font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white text-black'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="sora-font text-[14px]">{name}</span>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); showEditModal(index); }}
                title={trans.common.editTeamName}
              >
                <img src='/image/edit_icon.png' alt='Edit' width={12} height={12} />
              </button>
            </div>
            
            {(index >= 3 || (index < 3 && teamKeys.length > 3)) && (
              <button
                className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleDeleteTeam(index); }}
                title={trans.teammate.delete}
              >
                &times;
              </button>
            )}
          </div>
        );
      })}

      <div
        className="text-center cursor-pointer transition-all duration-200 border-2 border-black rounded-full px-6 py-2 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] flex items-center justify-center"
        onClick={showAddModal}
        title={trans.teammate.addTeam}
      >
        <img src='/image/add_icon.png' alt='Add new team' width={18} height={18} />
      </div>

      <button 
        className="cursor-pointer bg-white hover:bg-[#fcf8f2] border-2 border-black rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all" 
        onClick={handleNextTeam}
      >
        <img src='/image/right_icon.png' alt='Next team' width={14} height={14} />
      </button>

      <Modal
        title={editIndex !== null ? trans.teammate.changeName : trans.teammate.addTeam}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        destroyOnClose
        className="sircle-modal"
      >
        <Input
          placeholder={trans.teammate.teamName}
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="border-2 border-black rounded-xl h-10 mt-3"
        />
      </Modal>
    </div>
  );
};
