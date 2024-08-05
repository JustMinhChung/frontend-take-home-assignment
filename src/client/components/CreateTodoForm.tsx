import { useState } from 'react'

import { api } from '@/utils/client/api'

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

const TODO_INPUT_ID = 'todo-input-id'

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState('')

  const apiContext = api.useContext()

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch()
      },
    })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTodo({
      body: todoBody,
    })
    setTodoBody('')
  }

  return (
    <form
      className="group flex items-center justify-between rounded-12 border border-gray-200 py-2 pr-4 focus-within:border-gray-400"
      onSubmit={handleSubmit}
    >
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTodoBody(e.target.value)
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
        }}
        className="flex-1 px-4 text-base placeholder:text-gray-400 focus:outline-none"
      />

      <button
        className="flex-none rounded-full bg-gray-700 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        type="submit"
        disabled={isCreatingTodo}
      >
        Add
      </button>
    </form>
  )
}
