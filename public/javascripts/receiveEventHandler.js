function ReceiveEventHandler(scope){
    var myScope = scope;
    var firstTime = true;
    var self = this;

    this.addToEditor = function(obj){
        if(obj.color !== myScope.color){
            myScope._editor.replaceRange(obj.text,{
                line: obj.from.line,
                ch: obj.from.ch
            }, {
                line: obj.to.line,
                ch: obj.to.ch
            });
        }
    };

    this.cursorActivity = function(obj){
        for(var i=0; i !== myScope.users.length; ++i){
            if(myScope.users[i].color === obj.color){
                myScope.$apply(function(){
                    myScope.users[i].x = obj.x;
                    myScope.users[i].y = obj.y;
                });
            }
        }
    };

    this["cut"] = function(obj){
        self.deleteFromEditor(obj);
    };

    this["+delete"] = function(obj){
        self.deleteFromEditor(obj);
    };

    this.deleteFromEditor = function(obj){
        if(obj.color !== myScope.color){
            myScope._editor.replaceRange("",{
                line: obj.from.line,
                ch: obj.from.ch
            }, {
                line: obj.to.line,
                ch: obj.to.ch
            });
        }
    };

    this["+input"] = function(obj){
        self.addToEditor(obj);
    };

    this["paste"] = function(obj){
        self.addToEditor(obj);
    };

    this.postsubscribe = function(obj){
        obj.text = (firstTime)? "Welcome " + scope.name : obj.name + " has entered the room";
        firstTime = false;
        myScope.AddChatMessage(obj);
        myScope.AddUser({ name:obj.name, color:obj.color});
    };

    this.scrollIntoView = function(obj){
        myScope.AddChatMessage(obj);
    };

    this.sendMessage = function(obj){
        myScope.AddChatMessage(obj);
    };

    this.subscribe = function(obj){
        if(scope.color == ""){
            scope.color = obj.color;
            scope.PostSubscribe();
        }
    };

    this.unsubscribe = function(obj){
        myScope.RemoveUser(obj.color, function(whoLeft){
            var name = (whoLeft.name) || "User";
            obj.text = name + " has left the room";
            myScope.AddChatMessage(obj);
        });
    };
}