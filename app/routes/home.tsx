import type { Route } from "./+types/home";
import {NavLink, useNavigate} from "react-router";
import {Button} from "primereact/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checklist Generator" },
    { name: "description", content: "Welcome to Checklist Generator" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const onNewListClick = () => {
    const newChecklistId = crypto.randomUUID()
    localStorage.setItem(newChecklistId, JSON.stringify({
      id: newChecklistId,
      title: 'New Checklist',
      items: []
    }))
    navigate(`/checklist/${newChecklistId}`)
  }

  return <>
    <h1 className="leading-6 text-gray-700 dark:text-gray-200 text-center text-3xl mb-0">
      Welcome to the Checklist Generator!
    </h1>

    <p className="text-gray-700/50 dark:text-gray-300/50 text-center">
      This tool helps you create a checklist for your project.
    </p>

    <div className='flex gap-4 justify-center'>
      <Button label='Start a new checklist' icon='pi pi-plus' severity='success' onClick={ onNewListClick }/>
      <NavLink to='/load-checklist'
               className='bg-blue-800 px-5 py-2 rounded-lg flex gap-2 items-center'>
        <i className='pi pi-cloud-upload' />
        Load existing checklist
      </NavLink>
    </div>
  </>
}
