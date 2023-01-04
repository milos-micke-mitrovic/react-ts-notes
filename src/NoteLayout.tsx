import { Navigate, Outlet, useOutletContext, useParams } from "react-router";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[];
};

export const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();

  const note = notes.find((n) => n.id === id);

  if (note == null) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={note} />;
};

export const useNote = () => {
  return useOutletContext<Note>();
};
