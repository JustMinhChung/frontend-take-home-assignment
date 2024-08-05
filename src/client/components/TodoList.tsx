import type { SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import * as Tabs from '@radix-ui/react-tabs'
import React, { useEffect, useRef, useState } from 'react'
import autoAnimate from '@formkit/auto-animate'

import { api } from '@/utils/client/api'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

type TodoStatus = 'completed' | 'pending'

export const TodoList = () => {
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus | 'all'>(
    'all'
  )

  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses:
      selectedStatus === 'all' ? ['completed', 'pending'] : [selectedStatus],
  })

  const apiContext = api.useContext()
  const { mutate: updateTodoStatus } = api.todoStatus.update.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })
  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })

  const handleStatusChange = (todoId: number, currentStatus: TodoStatus) => {
    updateTodoStatus({
      todoId,
      status: currentStatus === 'pending' ? 'completed' : 'pending',
    })
  }

  const handleDelete = (todoId: number) => {
    deleteTodo({
      id: todoId,
    })
  }

  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (listRef.current) {
      autoAnimate(listRef.current)
    }
  }, [listRef])

  return (
    <div>
      <Tabs.Root
        defaultValue="all"
        onValueChange={(value) =>
          setSelectedStatus(value as TodoStatus | 'all')
        }
      >
        <Tabs.List className="flex space-x-2">
          <Tabs.Trigger
            value="all"
            className={`rounded-full border border-gray-300 px-6 py-2 text-sm font-bold transition-colors duration-300 focus:outline-none
              ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 bg-gray-700 text-white'
                  : 'bg-white text-gray-800'
              }
              mb-8`}
          >
            All
          </Tabs.Trigger>
          <Tabs.Trigger
            value="pending"
            className={`rounded-full border border-gray-300 px-5 py-2 text-sm font-bold transition-colors duration-300 focus:outline-none
              ${
                selectedStatus === 'pending'
                  ? 'bg-blue-600 bg-gray-700 text-white'
                  : 'bg-white text-gray-800'
              }
              mb-8`}
          >
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger
            value="completed"
            className={`rounded-full border border-gray-300 px-6 py-1 text-sm font-bold transition-colors duration-300 focus:outline-none
              ${
                selectedStatus === 'completed'
                  ? 'bg-blue-600 bg-gray-700 text-white'
                  : 'bg-white text-gray-800'
              }
              mb-8`}
          >
            Completed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all">
          <ul ref={listRef} className="grid grid-cols-1 gap-y-3">
            {todos.map((todo) => (
              <li key={todo.id}>
                <div
                  className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                    todo.status === 'completed' ? 'bg' : ''
                  }`}
                >
                  <Checkbox.Root
                    id={String(todo.id)}
                    checked={todo.status === 'completed'}
                    onCheckedChange={() =>
                      handleStatusChange(todo.id, todo.status)
                    }
                    className={`flex h-6 w-6 items-center justify-center rounded-6 border focus:outline-none
                        ${
                          todo.status === 'completed'
                            ? 'bg-gray-700'
                            : 'bg-white'
                        }
                        transition-colors duration-300`}
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="h-4 w-4 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <label
                    className={`block pl-3 font-medium ${
                      todo.status === 'completed'
                        ? 'text-gray-500 line-through'
                        : ''
                    }`}
                    htmlFor={String(todo.id)}
                  >
                    {todo.body}
                  </label>

                  <button
                    className="hover:text-red-500 ml-auto p-1 text-gray-500"
                    onClick={() => handleDelete(todo.id)}
                    aria-label="Delete todo"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content value="pending">
          <ul ref={listRef} className="grid grid-cols-1 gap-y-3">
            {todos
              .filter((todo) => todo.status === 'pending')
              .map((todo) => (
                <li key={todo.id}>
                  <div
                    className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                      todo.status === 'completed' ? 'bg-gray-700' : ''
                    }`}
                  >
                    <Checkbox.Root
                      id={String(todo.id)}
                      checked={todo.status === 'completed'}
                      onCheckedChange={() =>
                        handleStatusChange(todo.id, todo.status)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="h-4 w-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>

                    <label
                      className={`block pl-3 font-medium ${
                        todo.status === 'completed'
                          ? 'line-through-custom text-white'
                          : ''
                      }`}
                      htmlFor={String(todo.id)}
                    >
                      {todo.body}
                    </label>

                    <button
                      className="hover:text-red-500 ml-auto p-1 text-gray-500"
                      onClick={() => handleDelete(todo.id)}
                      aria-label="Delete todo"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Tabs.Content>
        <Tabs.Content value="completed">
          <ul ref={listRef} className="grid grid-cols-1 gap-y-3">
            {todos
              .filter((todo) => todo.status === 'completed')
              .map((todo) => (
                <li key={todo.id}>
                  <div
                    className={`flex items-center rounded-12 border border-gray-300 px-4 py-3 shadow-sm ${
                      todo.status === 'completed'
                        ? 'text-gray-500 line-through'
                        : ''
                    }`}
                  >
                    <Checkbox.Root
                      id={String(todo.id)}
                      checked={todo.status === 'completed'}
                      onCheckedChange={() =>
                        handleStatusChange(todo.id, todo.status)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                    >
                      <Checkbox.Indicator>
                        <CheckIcon className="h-4 w-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>

                    <label
                      className={`block pl-3 font-medium ${
                        todo.status === 'completed'
                          ? 'line-through-custom text-gray-500'
                          : ''
                      }`}
                      htmlFor={String(todo.id)}
                    >
                      {todo.body}
                    </label>

                    <button
                      className="hover:text-red-500 ml-auto p-1 text-gray-500"
                      onClick={() => handleDelete(todo.id)}
                      aria-label="Delete todo"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
