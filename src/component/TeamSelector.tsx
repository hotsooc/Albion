'use client';

import { useState } from 'react';
import { Modal, Input } from 'antd';
import useTrans from '@/hooks/useTrans';
import { ChevronLeft, ChevronRight, Pencil, Plus } from 'lucide-react';

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
    <div className='flex flex-row gap-4 w-full justify-center overflow-auto items-center p-4 text-[var(--text-primary)] theme-transition'>
      <button 
        className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] border-2 border-[var(--border-color)] rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all will-change-transform backface-visibility-hidden" 
        onClick={handlePrevTeam}
      >
        <ChevronLeft size={14} className="text-[var(--text-primary)]" />
      </button>

      {Array.isArray(teamNames) && teamNames.map((name, index) => {
        const isActive = openTeamIndex === index;
        return (
          <div
            key={index}
            onClick={() => handleToggleTeam(index)}
            className={`text-center font-bold cursor-pointer transition-all duration-200 border-2 border-[var(--border-color)] rounded-full px-6 py-2 relative group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] will-change-transform backface-visibility-hidden ${
              isActive 
                ? 'bg-[var(--color-accent)] text-[var(--text-primary)] font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-[var(--bg-panel-solid)] text-[var(--text-primary)]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="sora-font text-[14px]">{name}</span>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); showEditModal(index); }}
                title={trans.common.editTeamName}
              >
                <Pencil size={12} className="text-[var(--text-primary)]" />
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
        className="text-center cursor-pointer transition-all duration-200 border-2 border-[var(--border-color)] rounded-full px-6 py-2 bg-[var(--bg-panel-solid)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] flex items-center justify-center will-change-transform backface-visibility-hidden"
        onClick={showAddModal}
        title={trans.teammate.addTeam}
      >
        <Plus size={18} className="text-[var(--text-primary)]" />
      </div>

      <button 
        className="cursor-pointer bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-column)] border-2 border-[var(--border-color)] rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all will-change-transform backface-visibility-hidden" 
        onClick={handleNextTeam}
      >
        <ChevronRight size={14} className="text-[var(--text-primary)]" />
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
          className="border-2 border-[var(--border-color)] rounded-xl h-10 mt-3"
        />
      </Modal>
    </div>
  );
};
