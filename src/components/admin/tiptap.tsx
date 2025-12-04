'use client'

import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

// --- Custom UI ---
import { HeadingDropdownMenu } from '../tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '../tiptap-ui/list-dropdown-menu'
import { MarkButton } from '../tiptap-ui/mark-button'
import { TextAlignButton } from '../tiptap-ui/text-align-button'
import { AiAskButton } from '@/components/tiptap-ui/ai-ask-button'

// --- Extensions ---
import { TaskItem } from '@tiptap/extension-list'
import Ai from '@tiptap-pro/extension-ai'
import { UiState } from '../tiptap-extension/ui-state-extension'

// --- Styles ---
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'

// --- AI Context ---
import { AiProvider, useAi } from '@/contexts/ai-context'
import { AiMenu } from '../tiptap-ui/ai-menu'

const MenuBar = ({ editor }: any) => {
  if (!editor) return null

  return (
    <div className="mb-2 flex gap-2">

      <AiAskButton />   {/* Không truyền editor */}

      <HeadingDropdownMenu
        editor={editor}
        levels={[1, 2, 3, 4, 5, 6]}
        portal={false}
      />
      <ListDropdownMenu
        editor={editor}
        types={['bulletList', 'orderedList']}
        portal={false}
      />
      <MarkButton editor={editor} type="bold" />
      <MarkButton editor={editor} type="italic" />
      <MarkButton editor={editor} type="underline" />

      <TextAlignButton editor={editor} align="left" />
      <TextAlignButton editor={editor} align="center" />
      <TextAlignButton editor={editor} align="right" />
      <TextAlignButton editor={editor} align="justify" />
    </div>
  )
}

export default function TiptapWrapper(props: any) {
  return (
    <AiProvider>
      <Tiptap {...props} />
    </AiProvider>
  )
}

function Tiptap({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const { aiToken } = useAi()

  if (!aiToken) return <div>Loading AI…</div>

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      UiState,
      TaskItem.configure({ nested: false }),
      Ai.configure({
        appId: import.meta.env.VITE_AI_APP_ID,
        token: aiToken,
        
        autocompletion: false,
        showDecorations: true,
        hideDecorationsOnStreamEnd: false,
        onLoading: (context) => {
          context.editor.commands.aiGenerationSetIsLoading(true)
          context.editor.commands.aiGenerationHasMessage(false)
        },
        onChunk: (context) => {
          context.editor.commands.aiGenerationSetIsLoading(true)
          context.editor.commands.aiGenerationHasMessage(true)
        },
        onSuccess: (context) => {
          const hasMessage = !!context.response
          context.editor.commands.aiGenerationSetIsLoading(false)
          context.editor.commands.aiGenerationHasMessage(hasMessage)
        },
      }),
    ],

    editorProps: {
      attributes: {
        class:
          'min-h-[250px] w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring',
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Set initial content on edit
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  return (
    <EditorContext.Provider value={{ editor }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} >
        <AiMenu />  
     </EditorContent>
    </EditorContext.Provider>
  )
}
