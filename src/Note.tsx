import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useNote } from "./NoteLayout";

type NoteProps = {
  onDelete: (id: string) => void;
};

const Note = ({ onDelete }: NoteProps) => {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <>
      <Row className="aligni-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>

          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap h6">
              {note.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>

        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`} className="d-flex">
              <Button>Edit</Button>
            </Link>

            <Button
              onClick={() => {
                onDelete(note.id);
                navigate("/");
              }}
              variant="outline-danger"
            >
              Delete
            </Button>

            <Link to="..">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>

      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  );
};

export default Note;
