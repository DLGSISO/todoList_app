$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)

    $("#todoInput").keypress(function(event){
        if(event.which == 13){
            createTodo();
        }
    });


    $(".list").on("click", 'li',function(){
        updateTodo($(this));
    });


    $(".list").on("click", "span",function(e){
        e.stopPropagation();
        var clickedId = $(this).parent().data("id");
        $(this).parent().remove();
        $.ajax({
            method: 'DELETE',
            url: '/api/todos/' + clickedId //delete specific todo
        })
        .then(function(data){
            console.log(data);
        })
        .catch(function(err){
            console.log(err)
        })
    });
});


function addTodos(todos){
    todos.forEach(function(todo){
        addTodo(todo);
    })
};

function addTodo(todo){
    var newTodo = $('<li class="task">' + todo.name + "<span>X</span></li>");
    newTodo.data('id', todo._id);
    newTodo.data("completed", todo.completed)
    if(todo.completed){
        newTodo.addClass("done");
    }
    $(".list").append(newTodo);
}

function createTodo(){
    //send request to create new todo
    var usrInput = $('#todoInput').val();
    $.post('/api/todos',{name: usrInput})
    .then(function(newTodo){
        addTodo(newTodo);
        $('#todoInput').val("");
    })
    .catch(function(err){
        console.log(err);
    })
}

function updateTodo(todo){
    var updateUrl = "/api/todos/" + todo.data("id");
    var isDone = todo.data("completed");
    var updateData = {completed: !isDone};
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updateTodo){
        todo.toggleClass('done');
        todo.data("completed", isDone);
    })
    .catch(function(err){
        console.log(err)
    })
}