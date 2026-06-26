import { Link, useParams } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import PageLoader from "../components/ui/PageLoader";
import Button from "../components/ui/Button";
import Board from "../components/board/Board";

function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const projectQuery = useProject(projectId ?? "");

  if (!projectId) {
    return null;
  }

  if (projectQuery.isPending) {
    return <PageLoader />;
  }

  if (projectQuery.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-base font-semibold text-slate-900">
          Couldn’t load this project
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          {projectQuery.error.message}
        </p>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => projectQuery.refetch()}
            isLoading={projectQuery.isFetching}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const project = projectQuery.data;

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col">
      <header className="mb-4 flex items-center gap-3">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Projects
        </Link>
        <span className="text-slate-300" aria-hidden="true">
          /
        </span>
        <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
      </header>

      <div className="min-h-0 flex-1">
        <Board projectId={project._id} lists={project.lists} />
      </div>
    </div>
  );
}

export default BoardPage;
