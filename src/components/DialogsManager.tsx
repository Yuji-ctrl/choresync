import React from 'react';
import { PhotoCaptureDialog } from './PhotoCaptureDialog';
import { ShareDialog } from './ShareDialog';
import { ChoreCompletionDialog } from './ChoreCompletionDialog';
import { Chore, ChorePhoto, FamilyMember } from '../types';

interface DialogsManagerProps {
  photoCaptureChore: Chore | null;
  setPhotoCaptureChore: (chore: Chore | null) => void;
  sharePhoto: ChorePhoto | null;
  setSharePhoto: (photo: ChorePhoto | null) => void;
  completionChore: Chore | null;
  setCompletionChore: (chore: Chore | null) => void;
  chores: Chore[];
  familyMembers: FamilyMember[];
  currentUserId: string;
  handleSavePhotoWithUser: (choreId: string, imageFiles: File[], comment: string) => Promise<void>;
  handleChoreCompletionWithNotification: (
    choreId: string,
    completedBy: string,
    completedByName: string,
    timeSpent: number
  ) => void;
}

export function DialogsManager({
  photoCaptureChore,
  setPhotoCaptureChore,
  sharePhoto,
  setSharePhoto,
  completionChore,
  setCompletionChore,
  chores,
  familyMembers,
  currentUserId,
  handleSavePhotoWithUser,
  handleChoreCompletionWithNotification,
}: DialogsManagerProps) {
  return (
    <>
      <PhotoCaptureDialog
        isOpen={!!photoCaptureChore}
        onClose={() => setPhotoCaptureChore(null)}
        chore={photoCaptureChore}
        onSavePhoto={handleSavePhotoWithUser}
      />

      <ShareDialog
        isOpen={!!sharePhoto}
        onClose={() => setSharePhoto(null)}
        photo={sharePhoto}
        chore={sharePhoto ? chores.find(c => c.id === sharePhoto.choreId) || null : null}
      />

      <ChoreCompletionDialog
        isOpen={!!completionChore}
        onClose={() => setCompletionChore(null)}
        chore={completionChore}
        familyMembers={familyMembers}
        currentUserId={currentUserId}
        onComplete={handleChoreCompletionWithNotification}
      />
    </>
  );
}