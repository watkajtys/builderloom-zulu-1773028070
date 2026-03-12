import { useState, useEffect, useCallback } from 'react';
import PocketBase from 'pocketbase';
import { GripVertical } from 'lucide-react';

// Using window.location.hostname for PocketBase connection as per memory constraints
const pb = new PocketBase(`${window.location.protocol}//${window.location.hostname}:8090`);

export interface KanbanTask {
  id: string;
  title: string;
  status: string;
  order_index: number;
}

const KANBAN_COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'];

// Custom hook to manage Kanban state and logic
export function useKanban() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchTasks = async () => {
      try {
        const records = await pb.collection('kanban_tasks').getFullList<KanbanTask>({
          sort: 'order_index',
        });
        setTasks(records);
      } catch (e) {
        console.error("Error fetching tasks:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to real-time changes
    pb.collection('kanban_tasks').subscribe<KanbanTask>('*', (e) => {
      setTasks(prev => {
        if (e.action === 'create') {
          return [...prev, e.record].sort((a, b) => a.order_index - b.order_index);
        }
        if (e.action === 'update') {
          return prev.map(t => t.id === e.record.id ? e.record : t).sort((a, b) => a.order_index - b.order_index);
        }
        if (e.action === 'delete') {
          return prev.filter(t => t.id !== e.record.id);
        }
        return prev;
      });
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(err => {
      console.error("Subscription error:", err);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const bulkUpdateOrders = useCallback(async (orderedTasks: KanbanTask[]) => {
    // Optimistic UI update
    setTasks(prev => {
      const updatedIds = new Set(orderedTasks.map(t => t.id));
      const remainingTasks = prev.filter(t => !updatedIds.has(t.id));
      const newTasks = orderedTasks.map((t, i) => ({ ...t, order_index: i }));
      return [...remainingTasks, ...newTasks].sort((a, b) => a.order_index - b.order_index);
    });

    try {
      // Create updates sequentially (or via Promise.all if not ordered-dependent in backend)
      await Promise.all(
        orderedTasks.map((t, i) => 
          pb.collection('kanban_tasks').update(t.id, {
            order_index: i,
            status: t.status
          })
        )
      );
    } catch (err) {
      console.error("Bulk update error:", err);
    }
  }, []);

  return { tasks, loading, bulkUpdateOrders };
}

export function KanbanBoard() {
  const { tasks, loading, bulkUpdateOrders } = useKanban();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    // Needed for Firefox
    e.dataTransfer.effectAllowed = 'move';
    // Fallback for Playwright/tests
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId') || draggedTaskId;
    if (!taskId) return;
    setDraggedTaskId(null);

    const targetElement = (e.target as HTMLElement).closest('.kanban-task-card') as HTMLElement | null;
    
    const colTasks = tasks.filter(t => t.status === columnId).sort((a, b) => a.order_index - b.order_index);
    const draggedTask = tasks.find(t => t.id === taskId);
    if (!draggedTask) return;

    // Filter out the dragged task from the column it is entering if it was already there
    let newColTasks = colTasks.filter(t => t.id !== taskId);

    let dropIndex = newColTasks.length;
    
    if (targetElement) {
      const targetId = targetElement.dataset.taskid;
      const targetRect = targetElement.getBoundingClientRect();
      const dropY = e.clientY - targetRect.top;
      
      const targetIndex = newColTasks.findIndex(t => t.id === targetId);
      if (targetIndex !== -1) {
        if (dropY < targetRect.height / 2) {
          dropIndex = targetIndex;
        } else {
          dropIndex = targetIndex + 1;
        }
      }
    }

    // Insert task at the new index
    newColTasks.splice(dropIndex, 0, { ...draggedTask, status: columnId });
    
    // Now we must re-order all tasks in this column sequentially to ensure perfect integer ordering
    // We update all records in this column with their new index
    bulkUpdateOrders(newColTasks);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505]">
        <div className="text-[#00F2FF] font-mono animate-pulse">Initializing Board...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 text-zinc-grey font-sans">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Workflow Kanban</h1>
          <p className="text-sm">Human-in-the-Loop Steering Control</p>
        </div>
      </header>
      
      <div className="flex-1 flex gap-4 overflow-x-auto">
        {KANBAN_COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column).sort((a, b) => a.order_index - b.order_index);
          
          return (
            <div 
              key={column} 
              className="flex-1 min-w-[300px] max-w-[400px] flex flex-col bg-[#111111] rounded-lg border border-border-muted overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
              data-testid={`kanban-col-${column}`}
            >
              <div className="p-3 border-b border-border-muted bg-[#1A1A1A]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">{column.replace('_', ' ')}</h3>
                <span className="text-[10px] font-mono mt-1 text-zinc-grey">{columnTasks.length} TASKS</span>
              </div>
              
              <div className="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    data-taskid={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="kanban-task-card p-3 bg-[#1A1A1A] hover:bg-[#222222] border border-border-muted rounded cursor-grab active:cursor-grabbing transition-colors group flex gap-2 items-start"
                  >
                    <GripVertical size={16} className="text-zinc-grey/50 group-hover:text-[#00F2FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <p className="text-[10px] font-mono text-zinc-grey mt-1 border border-zinc-grey/30 rounded px-1 inline-block">IDX:{task.order_index}</p>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-border-muted rounded">
                    <span className="text-xs font-mono text-zinc-grey/50">DROP TASKS HERE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
