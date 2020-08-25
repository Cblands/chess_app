
async function post_board(board) {
        const content = {'board' : board}
        let response = await fetch("/submit_move", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(content)
        })
        return response.json()
}

export { post_board }