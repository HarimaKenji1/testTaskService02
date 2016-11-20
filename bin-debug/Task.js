var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
/*
interface TaskConditionContext {
    getCurrent();
    setCurrent(n: number);
}*/
var Task /* extends TaskEmitter implements TaskConditionContext*/ = (function () {
    function Task /* extends TaskEmitter implements TaskConditionContext*/(id, name, desc, total, status, /* taskcondition: TaskCondition,*/ fromNpcId, toNpcId) {
        this.current = 0;
        this.total = 100;
        //super();
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.total = total;
        //this.taskCondition = taskcondition;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }
    var d = __define,c=Task,p=c.prototype;
    //private taskCondition: TaskCondition;
    p.getCurrent = function () {
        return this.current;
    };
    p.setCurrent = function (n) {
        this.current += n;
        this.checkStatus();
    };
    p.checkStatus = function () {
        if (this.current >= this.total) {
            this.status = TaskStatus.CAN_SUBMIT;
        }
    };
    return Task /* extends TaskEmitter implements TaskConditionContext*/;
}());
egret.registerClass(Task /* extends TaskEmitter implements TaskConditionContext*/,'Task');
/*
class TaskCondition {
    constructor() { }
    onAccept(task) { }
    onSubmit(task) { }
    updateProccess(task, num) { }
}

class NPCTalkTaskCondition extends TaskCondition {
    constructor() {
        super();
    }
    // onAccept(task){}
    // onSubmit(task){}
    public updateProccess(task: TaskConditionContext, num: number) {
        task.setCurrent(num);
    }
}

class KillMonsterTaskCondition extends TaskCondition {
    constructor() {
        super();
    }
    onAccept(task) { }
    onSubmit(task) { }
    public updateProccess(task: TaskConditionContext, num: number) {
        task.setCurrent(num);
    }
}

class TaskEmitter {
    private observerList: Observer[];

    constructor(){
        this.observerList = [];
    }
    public addObserver(o: Observer) {
        this.observerList.push(o);
    }

    public notify(task: Task) {
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }
}


interface Observer {
    onChange(task: Task);
}

*/
var TaskService /*extends TaskEmitter implements Observer*/ = (function () {
    function TaskService /*extends TaskEmitter implements Observer*/() {
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    p.loadTasks = function () {
        this.taskList = {};
    };
    //private observerList : Observer[] = [];
    p.addTask = function (task) {
        this.taskList[task.id] = task;
    };
    // public addObserver(o : Observer){
    //     this.observerList.push(o);
    // }
    p.getTaskByCustomRule = function (rule) {
        return rule(this.taskList);
    };
    p.finish = function (id) {
        if (this.taskList[id].status == TaskStatus.CAN_SUBMIT) {
            this.taskList[id].status = TaskStatus.SUBMITTED;
        }
        // this.notify(this.taskList[id]);
    };
    p.accept = function (id) {
        if (this.taskList[id].status == TaskStatus.ACCEPTABLE) {
            this.taskList[id].status = TaskStatus.DURING;
        }
        //this.notify(this.taskList[id]);
    };
    p.canAccept = function (id) {
        if (this.taskList[id].status == TaskStatus.UNACCEPTABLE) {
            this.taskList[id].status = TaskStatus.ACCEPTABLE;
        }
        // this.notify(this.taskList[id]);
    };
    p.canFinish = function (id) {
        if (this.taskList[id].status == TaskStatus.DURING) {
            this.taskList[id].status = TaskStatus.CAN_SUBMIT;
        }
        // this.notify(this.taskList[id]);
    };
    // public notify(task : Task){
    //     for(var observer of this.observerList){
    //         observer.onChange(task);
    //     }
    // }
    p.onChange = function (task) {
        this.taskList[task.id] = task;
        //this.notify(this.taskList[task.id]);
    };
    return TaskService /*extends TaskEmitter implements Observer*/;
}());
egret.registerClass(TaskService /*extends TaskEmitter implements Observer*/,'TaskService');
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        var _this = this;
        _super.call(this);
        this.show = [];
        this.taskList = [];
        this.width = 256;
        this.height = 317;
        this.background = this.createBitmapByName("renwumianbanbeijing_png");
        this.addChild(this.background);
        this.background.width = 256;
        this.background.height = 317;
        this.background.x = 0;
        this.background.y = 0;
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = this.width / 2 - 100;
        this.textField.y = this.height / 2;
        this.textField.size = 15;
        this.textField.textColor = 0x000000;
        this.addChild(this.textField);
        this.textField.width = 200;
        this.textField.x = 30;
        this.textField.y = 80;
        // this.button = this.createBitmapByName("jieshou_gray_png");
        // this.ifAccept = true;
        // this.addChild(this.button);
        // this.button.x = 80;
        // this.button.y = 230;
        // this.button.touchEnabled = false;
        // this.button.alpha = 1;
        //this.onButtonClick();
        this.alpha = 0;
        var rule = function (taskList) {
            for (var taskId in taskList) {
                //console.log(taskId);
                _this.taskList.push(taskList[taskId]);
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        // this.taskList = rule;
        // for(var i = 0; i < this.taskList.length; i++){
        //     this.show[i] ="任务名 ：" + this.taskList[i].name + ":\n" +"任务内容："+ this.taskList[i].desc +" :\n" +" 任务状态 ：" + this.taskList[i].status;
        // }
        // for(var i = 0; i < this.show.length; i++){
        //     if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.SUBMITTED || this.taskList[i].status == TaskStatus.ACCEPTABLE)
        //     this.textField.text += this.show[i] + "\n";
        // }
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.onChange = function (task) {
        var _this = this;
        var i = 0;
        var rule = function (taskList) {
            for (var taskId in taskList) {
                _this.taskList[i] = taskList[taskId];
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == task.id) {
                egret.Tween.get(this).to({ alpha: 1 }, 500);
                //this.button.touchEnabled = true;
                if (this.taskList[i].status == TaskStatus.ACCEPTABLE) {
                    this.ifAccept = true;
                    var texture = RES.getRes("jieshou_png");
                }
                if (this.taskList[i].status == TaskStatus.CAN_SUBMIT) {
                    this.ifAccept = false;
                    var texture = RES.getRes("wancheng_png");
                }
                this.show[i] = "任务名 ：" + this.taskList[i].name + " :\n " + "任务内容：" + this.taskList[i].desc + " :\n " + " 任务状态 ： " + this.taskList[i].status;
                this.duringTaskId = this.taskList[i].id;
                this.textField.text = "";
                for (var i = 0; i < this.show.length; i++) {
                    if (this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.CAN_SUBMIT || this.taskList[i].status == TaskStatus.ACCEPTABLE)
                        this.textField.text += this.show[i] + "\n";
                }
                this.alpha = 1;
                //this.button.touchEnabled = true;
                break;
            }
        }
        // this.textField.text = "";
        // for(var i = 0; i < this.show.length - 1; i++){
        //     this.textField.text += this.show[i] + "\n";
        // }
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel');
//# sourceMappingURL=Task.js.map